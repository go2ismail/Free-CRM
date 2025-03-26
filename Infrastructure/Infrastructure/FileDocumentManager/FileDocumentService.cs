using System.Data;
using System.Data.Common;
using System.Dynamic;
using System.Globalization;
using System.Reflection;
using System.Text;
using System.Text.RegularExpressions;
using Application.Common.Repositories;
using Application.Common.Services.FileDocumentManager;
using CsvHelper;
using CsvHelper.Configuration;
using Domain.Common;
using Domain.Entities;
using Infrastructure.DataAccessManager.EFCore.Contexts;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;

namespace Infrastructure.FileDocumentManager;

public class FileDocumentService : IFileDocumentService
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly string _folderPath;
    private readonly int _maxFileSizeInBytes;
    private readonly ICommandRepository<FileDocument> _docRepository;
    private readonly IOrderRepository<string> _queryRepository;
    private readonly DataContext _dataContext;

    public FileDocumentService(
        IUnitOfWork unitOfWork,
        IOptions<FileDocumentSettings> settings,
        ICommandRepository<FileDocument> docRepository,
        IOrderRepository<string> queryRepository,
        DataContext dataContext
    )
    {
        _unitOfWork = unitOfWork;
        _folderPath = Path.Combine(Directory.GetCurrentDirectory(), settings.Value.PathFolder);
        _maxFileSizeInBytes = settings.Value.MaxFileSizeInMB * 1024 * 1024;
        _docRepository = docRepository;
        _queryRepository = queryRepository;
        _dataContext = dataContext;
    }

    public async Task<string> UploadAsync(
        string? originalFileName,
        string? docExtension,
        byte[]? fileData,
        long? size,
        string? description = "",
        string? createdById = "",
        CancellationToken cancellationToken = default)
    {

        if (string.IsNullOrWhiteSpace(docExtension) || docExtension.Contains(Path.DirectorySeparatorChar) || docExtension.Contains(Path.AltDirectorySeparatorChar))
        {
            throw new Exception($"Invalid file extension: {nameof(docExtension)}");
        }

        if (fileData == null || fileData.Length == 0)
        {
            throw new Exception($"File data cannot be null or empty: {nameof(fileData)}");
        }

        if (fileData.Length > _maxFileSizeInBytes)
        {
            throw new Exception($"File size exceeds the maximum allowed size of {_maxFileSizeInBytes / (1024 * 1024)} MB");
        }

        var fileName = $"{Guid.NewGuid():N}.{docExtension}";

        if (!Directory.Exists(_folderPath))
        {
            Directory.CreateDirectory(_folderPath);
        }

        var filePath = Path.Combine(_folderPath, fileName);

        await File.WriteAllBytesAsync(filePath, fileData, cancellationToken);

        var doc = new FileDocument();
        doc.Name = fileName;
        doc.OriginalName = originalFileName;
        doc.Extension = docExtension;
        doc.GeneratedName = fileName;
        doc.FileSize = size;
        doc.Description = description;
        doc.CreatedById = createdById;

        await _docRepository.CreateAsync(doc, cancellationToken);
        await _unitOfWork.SaveAsync(cancellationToken);

        return fileName;
    }

    public async Task<byte[]> GetFileAsync(string fileName, CancellationToken cancellationToken = default)
    {
        var filePath = Path.Combine(_folderPath, fileName);

        if (!File.Exists(filePath))
        {
            filePath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "nodocument.txt");
        }

        var result = await File.ReadAllBytesAsync(filePath, cancellationToken);

        return result;
    }
    
    public async Task<string> ExportTableToCsvAsync(string tableName, CancellationToken cancellationToken = default)
    {
        if (string.IsNullOrWhiteSpace(tableName))
        {
            throw new ArgumentException("Table name cannot be empty", nameof(tableName));
        }

        var query = $"SELECT * FROM {tableName}";
        var dataTable = await _queryRepository.ExecuteQueryAsync(query, cancellationToken);

        if (dataTable.Rows.Count == 0)
        {
            throw new Exception("No data found in the table.");
        }

        var csvFileName = $"{tableName}_{DateTime.UtcNow:yyyy-M-d dddd}.csv";
        var filePath = Path.Combine(_folderPath, csvFileName);

        var csvConfig = new CsvConfiguration(CultureInfo.InvariantCulture)
        {
            Delimiter = ";",
            Encoding = Encoding.UTF8
        };

        using (var writer = new StreamWriter(filePath, false, Encoding.UTF8))
        using (var csv = new CsvWriter(writer, csvConfig))
        {
            foreach (DataColumn column in dataTable.Columns)
            {
                csv.WriteField(column.ColumnName);
            }
            csv.NextRecord();

            foreach (DataRow row in dataTable.Rows)
            {
                for (int i = 0; i < dataTable.Columns.Count; i++)
                {
                    var column = dataTable.Columns[i];
                    var value = row[i];
                    
                    if (column.DataType == typeof(DateTime) && value is DateTime dateValue)
                    {
                        csv.WriteField(dateValue.ToString("yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture));
                    }
                    else
                    {
                        csv.WriteField(value);
                    }
                }
                csv.NextRecord();
            }
        }

        return filePath;
    }
    
    public async Task<int> ImportTableFromCsvAsync(string tableName, byte[] csvData, CancellationToken cancellationToken = default)
    {
        if (string.IsNullOrWhiteSpace(tableName))
            throw new ArgumentException("Table name is required", nameof(tableName));
        if (csvData == null || csvData.Length == 0)
            throw new ArgumentException("CSV data is required", nameof(csvData));
        
        var entityType = typeof(BaseEntity).Assembly.GetType("Domain.Entities." + tableName);
        if (entityType == null)
            throw new Exception($"Entity type for table '{tableName}' not found.");
        
        using var stream = new MemoryStream(csvData);
        using var reader = new StreamReader(stream, Encoding.UTF8);
        var csvConfig = new CsvConfiguration(CultureInfo.InvariantCulture)
        {
            Delimiter = ";",
            MissingFieldFound = null,
            HeaderValidated = null
        };
        using var csv = new CsvReader(reader, csvConfig);
        
        var records = csv.GetRecords<dynamic>().ToList();
        if (records.Count == 0)
            throw new Exception("No data found in CSV file.");

        int insertedCount = 0;
        using var transaction = await _dataContext.Database.BeginTransactionAsync(cancellationToken);
        try
        {
            var dbSetMethod = typeof(DbContext).GetMethod("Set", BindingFlags.Public | BindingFlags.Instance, null, Type.EmptyTypes, null)
                ?.MakeGenericMethod(entityType);

            var dbSet = dbSetMethod.Invoke(_dataContext, null);

            foreach (var record in records)
            {
                if (record is not IDictionary<string, object> recordDict)
                    continue;
                
                var entity = Activator.CreateInstance(entityType);
                foreach (var kvp in recordDict)
                {
                    // Inside the foreach loop where properties are set
                    var prop = entityType.GetProperty(kvp.Key, BindingFlags.IgnoreCase | BindingFlags.Public | BindingFlags.Instance);
                    if (prop != null && prop.CanWrite)
                    {
                        try
                        {
                            object value = null;
                            var propType = prop.PropertyType;
                            Type targetType = propType;
                            bool isNullable = propType.IsGenericType && propType.GetGenericTypeDefinition() == typeof(Nullable<>);
                            
                            if (propType.IsGenericType && propType.GetGenericTypeDefinition() == typeof(Nullable<>))
                            {
                                targetType = Nullable.GetUnderlyingType(propType);
                            }

                            string stringValue = kvp.Value?.ToString();
                            
                            if (string.IsNullOrEmpty(stringValue))
                            {
                                bool isReferenceOrNullableType = !targetType.IsValueType || isNullable;

                                if (isReferenceOrNullableType)
                                {
                                    prop.SetValue(entity, null);
                                    continue;
                                }
                                else
                                {
                                    throw new Exception($"Field '{kvp.Key}' cannot be null or empty.");
                                }
                            }
                            if (targetType == typeof(DateTime))
                            {
                                if (string.IsNullOrEmpty(stringValue))
                                {
                                    value = null;
                                }
                                else
                                {
                                    if (kvp.Value is DateTime dateTimeValue) 
                                    {
                                        value = DateTime.SpecifyKind(dateTimeValue, DateTimeKind.Unspecified);
                                    }
                                    else 
                                    {
                                        stringValue = kvp.Value?.ToString().Trim();
            
                                        string[] dateFormats = 
                                        {
                                            "MM/dd/yyyy HH:mm:ss", "MM/dd/yyyy hh:mm:ss tt", "M/d/yyyy HH:mm:ss",
                                            "dd-MM-yyyy HH:mm:ss", "dd/MM/yyyy HH:mm:ss", "yyyy-MM-dd HH:mm:ss",
                                            "MM/dd/yyyy", "dd-MM-yyyy", "yyyy-MM-dd", "dd/MM/yyyy",
                                            "yyyy-MM-ddTHH:mm:ssZ", "yyyy-MM-ddTHH:mm:ss.fffZ"
                                        };

                                        if (!DateTime.TryParseExact(
                                                stringValue,
                                                dateFormats,
                                                CultureInfo.InvariantCulture,
                                                DateTimeStyles.AllowWhiteSpaces | DateTimeStyles.AssumeLocal,
                                                out DateTime parsedDate))
                                        {
                                            throw new Exception($"Format date invalide pour '{kvp.Key}'. Valeur: '{stringValue}'");
                                        }
            
                                        value = DateTime.SpecifyKind(parsedDate, DateTimeKind.Unspecified);
                                    }
                                }

                            }

                            if (targetType.IsEnum)
                            {
                                if (Enum.TryParse(targetType, stringValue, true, out var enumValue))
                                {
                                    value = enumValue;
                                }
                                else
                                {
                                    throw new Exception($"Field '{kvp.Key}' has an invalid value. Expected one of: {string.Join(", ", Enum.GetNames(targetType))}.");
                                }
                            }

                            else if (targetType == typeof(decimal)) 
                            {
                                value = decimal.Parse(stringValue, CultureInfo.InvariantCulture);
                            }
                            else if (targetType == typeof(double))
                            {
                                value = double.Parse(stringValue, CultureInfo.InvariantCulture);
                            }
                            else if (targetType == typeof(float))
                            {
                                value = float.Parse(stringValue, CultureInfo.InvariantCulture);
                            }
                            else
                            {
                                value = Convert.ChangeType(stringValue, targetType);
                            }
                            
                            if (isNullable)
                            {
                                value = string.IsNullOrEmpty(stringValue) ? null : Convert.ChangeType(value, targetType);
                            }

                            prop.SetValue(entity, value);
                        }
                        catch (Exception ex)
                        {
                            throw new Exception($"Error mapping field '{kvp.Key}': {ex.Message}");
                        }
                    }
                }
                
                var addMethod = dbSet!.GetType().GetMethod("Add");
                addMethod!.Invoke(dbSet, new object[] { entity });
                insertedCount++;
            }

            await _dataContext.SaveChangesAsync(cancellationToken);
            await transaction.CommitAsync(cancellationToken);
        }
        catch (Exception ex)
        {
            await transaction.RollbackAsync(cancellationToken);
            throw new Exception($"Import failed: {ex.Message}", ex);
        }

        return insertedCount;
    }
    public async Task<Dictionary<string, int>> ImportMultipleTablesFromCsvAsync(byte[] csvData, CancellationToken cancellationToken = default)
    {
        if (csvData == null || csvData.Length == 0)
            throw new ArgumentException("CSV data is required", nameof(csvData));

        var results = new Dictionary<string, int>();
        var currentSection = string.Empty;
        List<string> currentHeaders = null;
        var currentTableRecords = new List<dynamic>();

        using var stream = new MemoryStream(csvData);
        using var reader = new StreamReader(stream, Encoding.UTF8);
        
        // Première passe: analyse du CSV
        var sections = new Dictionary<string, (List<string> Headers, List<dynamic> Records)>();
        string line;
        while ((line = await reader.ReadLineAsync()) != null)
        {
            if (string.IsNullOrWhiteSpace(line))
                continue;

            if (CsvImportHelper.IsSectionLine(line, out var newSection))
            {
                if (!string.IsNullOrEmpty(currentSection) && currentTableRecords.Count > 0)
                {
                    sections[currentSection] = (currentHeaders, currentTableRecords);
                }
                
                currentSection = newSection;
                currentHeaders = null;
                currentTableRecords = new List<dynamic>();
                continue;
            }

            if (string.IsNullOrEmpty(currentSection))
                continue;

            var values = line.Split(';').Select(v => v.Trim()).ToArray();
            
            if (currentHeaders == null)
            {
                currentHeaders = values.ToList();
            }
            else
            {
                var record = new ExpandoObject() as IDictionary<string, object>;
                for (int i = 0; i < currentHeaders.Count && i < values.Length; i++)
                {
                    record[currentHeaders[i]] = values[i];
                }
                currentTableRecords.Add(record);
            }
        }

        if (!string.IsNullOrEmpty(currentSection) && currentTableRecords.Count > 0)
        {
            sections[currentSection] = (currentHeaders, currentTableRecords);
        }

        if (sections.Count == 0)
            throw new Exception("No valid sections found in CSV file.");

        // Deuxième passe: traitement
        using var transaction = await _dataContext.Database.BeginTransactionAsync(cancellationToken);
        try
        {
            var importedEntities = new Dictionary<string, Dictionary<object, object>>();
            
            foreach (var section in sections)
            {
                var (tableName, headers, records) = (section.Key, section.Value.Headers, section.Value.Records);
                importedEntities[tableName] = new Dictionary<object, object>();

                var entityType = CsvImportHelper.FindEntityType(tableName) ?? 
                    throw new Exception($"Entity type for table '{tableName}' not found.");
                
                if (!CsvImportHelper.IsValidEntityType(_dataContext, entityType))
                    throw new Exception($"Type '{entityType.Name}' is not a valid entity type.");

                var dbSet = CsvImportHelper.GetDbSetForEntity(_dataContext, entityType);
                
                foreach (var record in records.Cast<IDictionary<string, object>>())
                {
                    var entity = Activator.CreateInstance(entityType);
                    
                    foreach (var kvp in record)
                    {
                        try
                        {
                            if (CsvImportHelper.IsForeignKeyProperty(entityType, kvp.Key, out var fkInfo))
                            {
                                CsvImportHelper.HandleForeignKey(entity, fkInfo, kvp.Value, importedEntities, _dataContext);
                            }
                            else
                            {
                                CsvImportHelper.SetPropertyValue(entity, entityType, kvp.Key, kvp.Value);
                            }
                        }
                        catch (Exception ex)
                        {
                            throw new Exception($"Error mapping field '{kvp.Key}' in table '{tableName}': {ex.Message}");
                        }
                    }

                    dbSet.GetType().GetMethod("Add")?.Invoke(dbSet, new[] { entity });
                    
                    // Store the entity with its primary key value
                    var keyValue = CsvImportHelper.GetPrimaryKeyValue(entity);
                    importedEntities[tableName][keyValue] = entity;
                }
                
                await _dataContext.SaveChangesAsync(cancellationToken);
                results.Add(tableName, records.Count);
            }

            await transaction.CommitAsync(cancellationToken);
        }
        catch (Exception ex)
        {
            await transaction.RollbackAsync(cancellationToken);
            throw new Exception($"Import failed: {ex.Message}", ex);
        }

        return results;
    }    
}

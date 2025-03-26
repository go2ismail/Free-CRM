using System.Data;
using System.Dynamic;
using System.Globalization;
using System.Linq.Expressions;
using System.Reflection;
using System.Text;
using System.Text.RegularExpressions;
using Application.Common.Repositories;
using Application.Common.Services.FileDocumentManager;
using CsvHelper;
using CsvHelper.Configuration;
using Domain.Common;
using Domain.Entities;
using Domain.Enums;
using Infrastructure.DataAccessManager.EFCore.Contexts;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Storage;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Options;

namespace Infrastructure.FileDocumentManager;

public class CSVService : ICSVService
{
    private readonly DataContext _context;
    private readonly IServiceProvider _serviceProvider;

    private readonly List<string> _dateFormats = new List<string> { "yyyy-MM-dd", "dd/MM/yyyy", "MM/dd/yyyy" };
    
    private readonly Random _random = new Random();

    public CSVService(DataContext context, IServiceProvider serviceProvider)
    {
        _context = context;
        _serviceProvider = serviceProvider;
    }

    public async Task<Dictionary<string, int>> ImportTablesFromCsvAsync(
        List<string> fileNames, 
        List<byte[]> csvDataList, 
        string createdById,
        CancellationToken cancellationToken = default)
    {
        var importedCounts = new Dictionary<string, int>();
        var errors = new List<string>();
        IDbContextTransaction transaction = null;

        try
        {
            transaction = await _context.Database.BeginTransactionAsync(cancellationToken);
            bool hasErrors = false;

            for (int i = 0; i < fileNames.Count; i++)
            {
                var fileName = fileNames[i];
                var csvData = csvDataList[i];

                using var stream = new MemoryStream(csvData);
                using var reader = new StreamReader(stream, Encoding.UTF8);
                using var csv = new CsvReader(reader, new CsvConfiguration(CultureInfo.InvariantCulture)
                {
                    MissingFieldFound = null,
                    HeaderValidated = null,
                    IgnoreBlankLines = true,
                    BadDataFound = context => Console.WriteLine($"Bad data found: {context.RawRecord}"),
                    Delimiter = ",", // Spécifiez explicitement le délimiteur
                    PrepareHeaderForMatch = args => args.Header.Trim(), // Nettoie les en-têtes
                    TrimOptions = TrimOptions.Trim // Nettoie les valeurs
                });

                await csv.ReadAsync();
                csv.ReadHeader();

                try
                {
                    if (IsChildTable(csv))
                    {
                        await ProcessChildTableAsync(csv, fileName, importedCounts, errors, createdById, cancellationToken);
                    }
                    else
                    {
                        await ProcessMotherTableAsync(csv, fileName, importedCounts, errors, createdById, cancellationToken);
                    }
                }
                catch (Exception ex)
                {
                    errors.Add($"Erreur lors du traitement du fichier {fileName}: {ex.Message}");
                    hasErrors = true;
                    break;
                }

                if (errors.Count > 0)
                {
                    hasErrors = true;
                    break;
                }
            }

            if (hasErrors)
            {
                if (transaction != null)
                {
                    await transaction.RollbackAsync(cancellationToken);
                    transaction = null;
                }
                throw new AggregateException(errors.Select(e => new InvalidOperationException(e)));
            }

            await _context.SaveChangesAsync(cancellationToken);
            
            if (transaction != null)
            {
                await transaction.CommitAsync(cancellationToken);
            }
        }
        catch (Exception)
        {
            if (transaction != null)
            {
                await transaction.RollbackAsync(cancellationToken);
            }
            throw;
        }
        finally
        {
            if (transaction != null)
            {
                await transaction.DisposeAsync();
            }
        }

        return importedCounts;
    }
    
    private bool IsChildTable(CsvReader csv)
    {
        return csv.HeaderRecord?.Contains("Type") ?? false;
    }

    private async Task ProcessMotherTableAsync(
        CsvReader csv, 
        string fileName, 
        Dictionary<string, int> importedCounts, 
        List<string> errors, 
        string createdById,
        CancellationToken cancellationToken)
    {
        string tableName;
        bool simpleFormat = !csv.HeaderRecord[0].Contains('_');

        if (simpleFormat)
        {
            tableName = Path.GetFileNameWithoutExtension(fileName)
                      .Replace(" ", "")
                      .Replace("-", "");
        }
        else
        {
            tableName = csv.HeaderRecord[0].Split('_')[0];
        }

        var entityType = GetEntityType(tableName);
        bool hasForeignKeys = HasForeignKeys(entityType);

        while (await csv.ReadAsync())
        {
            try
            {
                var entity = Activator.CreateInstance(entityType);
                int lineNumber = csv.Parser.Row;

                foreach (var header in csv.HeaderRecord)
                {
                    string propName;
                    if (simpleFormat)
                    {
                        propName = header;
                    }
                    else
                    {
                        var parts = header.Split('_');
                        if (parts.Length < 2 || parts[0] != tableName)
                        {
                            errors.Add($"Fichier {fileName}, ligne {lineNumber}: En-tête invalide '{header}'");
                            continue;
                        }
                        propName = string.Join("_", parts.Skip(1));
                    }

                    var prop = entityType.GetProperty(propName, BindingFlags.IgnoreCase | BindingFlags.Public | BindingFlags.Instance);
                    if (prop == null)
                    {
                        errors.Add($"Fichier {fileName}, ligne {lineNumber}: Propriété '{propName}' introuvable");
                        continue;
                    }

                    var value = csv.GetField(header);
                    var parsedValue = ParseValue(value, prop.PropertyType, fileName, lineNumber, errors);
                    prop.SetValue(entity, parsedValue);
                }
                
                if (hasForeignKeys)
                {
                    await ResolveAndAssignForeignKeys(entity, entityType, fileName, lineNumber, errors, cancellationToken);
                }

                // Set CreatedById before filling missing properties
                SetCreatedById(entity, createdById, fileName, lineNumber, errors);
                SetUpdatedByIdToNull(entity, fileName, lineNumber, errors);
                
                FillMissingProperties(entity, entityType, fileName, lineNumber, errors);
                ValidateEntity(entity, fileName, lineNumber, errors);

                _context.Add(entity);
                importedCounts[tableName] = importedCounts.GetValueOrDefault(tableName) + 1;
            }
            catch (Exception ex)
            {
                errors.Add($"Fichier {fileName}, ligne {csv.Parser.Row}: {ex.Message}");
            }
        }
    }
    private async Task ResolveAndAssignForeignKeys(
        object entity,
        Type entityType,
        string fileName,
        int line,
        List<string> errors,
        CancellationToken ct)
    {
        var entityModel = _context.Model.FindEntityType(entityType);
        if (entityModel == null) return;

        foreach (var fk in entityModel.GetForeignKeys())
        {
            var fkProperty = fk.Properties.First().Name;
            var principalType = fk.PrincipalEntityType.ClrType;

            var propInfo = entityType.GetProperty(fkProperty);
            if (propInfo == null || propInfo.GetValue(entity) != null)
                continue;

            // 1. Résolution non ambiguë de Set<TEntity>
            var setMethod = typeof(DbContext).GetMethods()
                .First(m => m.Name == nameof(DbContext.Set) 
                    && m.GetParameters().Length == 0)
                .MakeGenericMethod(principalType);
            
            var dbSet = (IQueryable)setMethod.Invoke(_context, null);

            // 2. Appel sécurisé avec typage explicite
            var anyAsyncMethod = typeof(EntityFrameworkQueryableExtensions)
                .GetMethods()
                .First(m => m.Name == nameof(EntityFrameworkQueryableExtensions.AnyAsync)
                    && m.GetParameters().Length == 2)
                .MakeGenericMethod(principalType);

            // Conversion explicite en tableau typé
            var parameters = new object?[] { dbSet, ct };
            
            // 3. Gestion de l'await avec dynamic
            dynamic anyTask = anyAsyncMethod.Invoke(null, parameters)!;
            var isEmpty = !await anyTask;

            if (isEmpty)
            {
                await GenerateFromSeeder(principalType.Name);
                dynamic refreshTask = anyAsyncMethod.Invoke(null, parameters)!;
                isEmpty = !await refreshTask;
            }

            object principalEntity;
            if (isEmpty)
            {
                principalEntity = Activator.CreateInstance(principalType)!;
                FillMissingProperties(principalEntity, principalType, fileName, line, errors);
                _context.Add(principalEntity);
                await _context.SaveChangesAsync(ct);
            }
            else
            {
                // 4. Résolution FirstAsync avec dynamic
                var firstAsyncMethod = typeof(EntityFrameworkQueryableExtensions)
                    .GetMethods()
                    .First(m => m.Name == nameof(EntityFrameworkQueryableExtensions.FirstAsync)
                        && m.GetParameters().Length == 2)
                    .MakeGenericMethod(principalType);

                dynamic firstTask = firstAsyncMethod.Invoke(null, parameters)!;
                principalEntity = await firstTask;
            }

            var idProperty = principalType.GetProperty("Id") 
                ?? throw new InvalidOperationException($"Id property missing in {principalType.Name}");
            
            propInfo.SetValue(entity, idProperty.GetValue(principalEntity));
        }
    }
    
    private async Task<object> GetRandomIdFromTable(Type entityType, CancellationToken ct)
    {
        // Accès réflexif au DbSet
        var setMethod = typeof(DbContext).GetMethod(nameof(DbContext.Set))!
            .MakeGenericMethod(entityType);
        var dbSet = (IQueryable)setMethod.Invoke(_context, null)!;

        var count = await dbSet.Cast<object>().CountAsync(ct);
        if (count == 0)
            throw new InvalidOperationException($"Table {entityType.Name} est vide même après génération");

        var skip = _random.Next(0, count);
        var entity = await dbSet.Cast<object>().Skip(skip).FirstAsync(ct);
        return entity.GetType().GetProperty("Id")!.GetValue(entity)!;
    }
   
    private async Task ProcessChildTableAsync(
        CsvReader csv, 
        string fileName, 
        Dictionary<string, int> importedCounts, 
        List<string> errors, 
        string createdById,
        CancellationToken cancellationToken)
    {
        while (await csv.ReadAsync())
        {
            Console.WriteLine($"Raw line: {csv.Parser.RawRecord}");
            Console.WriteLine($"Type field: {csv.GetField("Type")}");
            int lineNumber = csv.Parser.Row;
            var rawType = csv.GetField("Type")?.Trim();
            
            if (string.IsNullOrWhiteSpace(rawType))
            {
                errors.Add($"Fichier {fileName}, ligne {lineNumber}: Colonne 'Type' est requise mais vide");
                continue;
            }

            try
            {
                var type = CultureInfo.CurrentCulture.TextInfo.ToTitleCase(rawType.ToLower());

                var typeMappings = new Dictionary<string, string>(StringComparer.OrdinalIgnoreCase)
                {
                    ["Budget"] = "Budget",
                    ["Expense"] = "Expense",
                    ["Campaign"] = "Campaign"
                };

                if (!typeMappings.TryGetValue(type, out var entityTypeName))
                {
                    errors.Add($"Fichier {fileName}, ligne {lineNumber}: Type '{type}' non pris en charge");
                    continue;
                }

                Type childType;
                try
                {
                    childType = GetEntityType(entityTypeName);
                }
                catch (InvalidOperationException ex)
                {
                    errors.Add($"Fichier {fileName}, ligne {lineNumber}: {ex.Message}");
                    continue;
                }

                var fkInfo = GetForeignKeyInfo(childType);
                var childEntity = Activator.CreateInstance(childType);

                var motherEntity = await ResolveMotherEntityAsync(csv, fkInfo, fileName, lineNumber, errors, cancellationToken);
                
                if (motherEntity == null)
                {
                    errors.Add($"Fichier {fileName}, ligne {lineNumber}: Impossible de trouver l'entité mère");
                    continue;
                }
                
                var motherId = motherEntity.GetType().GetProperty("Id")?.GetValue(motherEntity);
                if (motherId == null || (motherId is Guid guid && guid == Guid.Empty))
                {
                    errors.Add($"Fichier {fileName}, ligne {lineNumber}: L'entité mère n'a pas d'ID valide");
                    continue;
                }
                
                SetForeignKey(childEntity, fkInfo, motherEntity);

                // Process each header in the CSV
                foreach (var header in csv.HeaderRecord.Where(h => 
                    !h.Equals("Type", StringComparison.OrdinalIgnoreCase) && 
                    !h.StartsWith(fkInfo.MotherTable + "_", StringComparison.OrdinalIgnoreCase)))
                {
                    // Handle special case for Date field
                    string propertyName = header;
                    if (header.Equals("Date", StringComparison.OrdinalIgnoreCase))
                    {
                        propertyName = $"{entityTypeName}Date"; // e.g. "BudgetDate", "ExpenseDate"
                    }

                    var prop = childType.GetProperty(propertyName, BindingFlags.IgnoreCase | BindingFlags.Public | BindingFlags.Instance);
                    if (prop == null)
                    {
                        errors.Add($"Fichier {fileName}, ligne {lineNumber}: Propriété '{propertyName}' introuvable");
                        continue;
                    }

                    var value = csv.GetField(header);
                    var parsedValue = ParseValue(value, prop.PropertyType, fileName, lineNumber, errors);
                    prop.SetValue(childEntity, parsedValue);
                }

                SetCreatedById(childEntity, createdById, fileName, lineNumber, errors);
                SetUpdatedByIdToNull(childEntity, fileName, lineNumber, errors);
                FillMissingProperties(childEntity, childType, fileName, lineNumber, errors);
                ValidateEntity(childEntity, fileName, lineNumber, errors);

                _context.Add(childEntity);
                importedCounts[type] = importedCounts.GetValueOrDefault(type) + 1;
            }
            catch (Exception ex)
            {
                errors.Add($"Fichier {fileName}, ligne {csv.Parser.Row}: {ex.Message}");
            }
        }
    }

    private void SetCreatedById(object entity, string createdById, string fileName, int line, List<string> errors)
    {
        try
        {
            var createdByProp = entity.GetType().GetProperty("CreatedById");
            if (createdByProp != null && createdByProp.PropertyType == typeof(string))
            {
                createdByProp.SetValue(entity, createdById);
            }
            else
            {
                errors.Add($"Fichier {fileName}, ligne {line}: Propriété CreatedById introuvable ou type incorrect");
            }
        }
        catch (Exception ex)
        {
            errors.Add($"Fichier {fileName}, ligne {line}: Erreur lors de l'affectation de CreatedById - {ex.Message}");
        }
    }
    
    private void SetUpdatedByIdToNull(object entity, string fileName, int line, List<string> errors)
    {
        try
        {
            var updatedByProp = entity.GetType().GetProperty("UpdatedById");
            if (updatedByProp != null && updatedByProp.PropertyType == typeof(string))
            {
                updatedByProp.SetValue(entity, null);
            }
        }
        catch (Exception ex)
        {
            errors.Add($"Fichier {fileName}, ligne {line}: Erreur lors de la mise à null de UpdatedById - {ex.Message}");
        }
    }

    private object ParseValue(string value, Type targetType, string fileName, int line, List<string> errors)
    {
        try
        {
            if (string.IsNullOrEmpty(value))
                return null;

            Type underlyingType = Nullable.GetUnderlyingType(targetType) ?? targetType;

            if (underlyingType == typeof(double) || underlyingType == typeof(float) || underlyingType == typeof(decimal))
            {
                // Gestion spéciale pour les séparateurs décimaux
                value = value.Replace(",", ".");
                if (double.TryParse(value, NumberStyles.Any, CultureInfo.InvariantCulture, out double result))
                {
                    if (result < 0)
                        throw new FormatException("Les valeurs négatives ne sont pas autorisées");
                
                    return Convert.ChangeType(result, underlyingType);
                }
                throw new FormatException("Format numérique invalide");
            }

            if (underlyingType == typeof(DateTime))
                return ParseDateTime(value, fileName, line, errors);

            if (underlyingType.IsEnum)
                return ParseEnum(value, underlyingType, fileName, line, errors);

            return Convert.ChangeType(value, underlyingType);
        }
        catch (Exception ex)
        {
            errors.Add($"Fichier {fileName}, ligne {line}: Erreur de conversion - {ex.Message}");
            return null;
        }
    }

    private DateTime ParseDateTime(string value, string fileName, int line, List<string> errors)
    {
        foreach (var format in _dateFormats)
        {
            if (DateTime.TryParseExact(value, format, CultureInfo.InvariantCulture, DateTimeStyles.None, out var result))
                return result;
        }
        errors.Add($"Fichier {fileName}, ligne {line}: Format de date invalide '{value}'");
        return DateTime.MinValue;
    }

    private object ParseEnum(string value, Type enumType, string fileName, int line, List<string> errors)
    {
        try
        {
            return Enum.Parse(enumType, value);
        }
        catch
        {
            errors.Add($"Fichier {fileName}, ligne {line}: Statut invalide '{value}' pour {enumType.Name}");
            return Activator.CreateInstance(enumType);
        }
    }
    
    private bool IsForeignKeyProperty(PropertyInfo prop, Type entityType)
    {
        var entity = _context.Model.FindEntityType(entityType);
        return entity?.GetForeignKeys().Any(fk => 
            fk.Properties.Any(p => p.Name == prop.Name)) ?? false;
    }

    private void FillMissingProperties(object entity, Type entityType, string fileName, int line, List<string> errors)
    {
        foreach (var prop in entityType.GetProperties()
                     .Where(p => p.Name != "Id" && p.Name != "CreatedById" && p.Name != "UpdatedById" && !IsForeignKeyProperty(p, entityType)))
        {
            try
            {
                var currentValue = prop.GetValue(entity);
                bool shouldGenerate = 
                    currentValue == null ||
                    (currentValue is double d && d == 0) ||
                    (currentValue is float f && f == 0) ||
                    (currentValue is decimal m && m == 0) ||
                    (prop.PropertyType == typeof(string) && string.IsNullOrEmpty((string)currentValue));

                if (shouldGenerate)
                {
                    var generated = GenerateData(prop);
                    prop.SetValue(entity, generated);
                }
            }
            catch (Exception ex)
            {
                errors.Add($"Erreur génération {prop.Name}: {ex.Message}");
            }
        }
    }

    private object GenerateData(PropertyInfo prop)
    {
        try
        {
            Type targetType = Nullable.GetUnderlyingType(prop.PropertyType) ?? prop.PropertyType;
            var random = new Random();

            if (targetType == typeof(decimal))
                return (decimal)Math.Round(10000 * Math.Ceiling((random.NextDouble() * 89) + 1), 2);

            if (targetType == typeof(double))
                return Math.Round(10000 * Math.Ceiling((random.NextDouble() * 89) + 1), 2);

            if (targetType == typeof(float))
                return (float)Math.Round(10000 * Math.Ceiling((random.NextDouble() * 89) + 1), 2);

            if (targetType == typeof(DateTime))
                return DateTime.Now.AddDays(-random.Next(1, 365));

            if (targetType.IsEnum)
                return GetRandomStatus(targetType);

            if (targetType == typeof(string))
                return $"TEXT {Guid.NewGuid().ToString().Substring(0, 5)}";

            if (targetType == typeof(int))
                return random.Next(1, 1000);

            return targetType.IsValueType ? Activator.CreateInstance(targetType) : null;
        }
        catch
        {
            return prop.PropertyType.IsValueType ? Activator.CreateInstance(prop.PropertyType) : null;
        }
    }

    private bool HasForeignKeys(Type entityType)
    {
        var entity = _context.Model.FindEntityType(entityType);
        return entity?.GetForeignKeys().Any() ?? false;
    }
    
    private object GetRandomStatus(Type enumType)
    {
        var random = new Random();
        return enumType.Name switch
        {
            nameof(BudgetStatus) => BudgetStatusValues[random.Next(BudgetStatusValues.Length)],
            nameof(CampaignStatus) => CampaignStatusValues[random.Next(CampaignStatusValues.Length)],
            nameof(ExpenseStatus) => ExpenseStatusValues[random.Next(ExpenseStatusValues.Length)],
            _ => throw new NotSupportedException()
        };
    }

    private static readonly BudgetStatus[] BudgetStatusValues = { BudgetStatus.Draft, BudgetStatus.Cancelled, BudgetStatus.Confirmed, BudgetStatus.Archived };
    private static readonly CampaignStatus[] CampaignStatusValues = { CampaignStatus.Draft, CampaignStatus.Cancelled, CampaignStatus.Confirmed, CampaignStatus.OnProgress, CampaignStatus.OnHold, CampaignStatus.Finished, CampaignStatus.Archived };
    private static readonly ExpenseStatus[] ExpenseStatusValues = { ExpenseStatus.Draft, ExpenseStatus.Cancelled, ExpenseStatus.Confirmed, ExpenseStatus.Archived };

    private void ValidateEntity(object entity, string fileName, int line, List<string> errors)
    {
        foreach (var prop in entity.GetType().GetProperties())
        {
            if (prop.PropertyType == typeof(decimal) && (decimal)prop.GetValue(entity) < 0)
                errors.Add($"Fichier {fileName}, ligne {line}: Valeur négative pour {prop.Name}");
        }
    }

    private Type GetEntityType(string tableName)
    {
        if (string.IsNullOrEmpty(tableName))
        {
            throw new ArgumentNullException(nameof(tableName), "Table name cannot be null or empty");
        }

        var type = Assembly.GetAssembly(typeof(BaseEntity))
            ?.GetTypes()
            .FirstOrDefault(t => t.Name.Equals(tableName, StringComparison.OrdinalIgnoreCase));

        if (type == null)
        {
            throw new InvalidOperationException($"Table/Entity '{tableName}' not found in the domain model");
        }

        return type;
    }

    private ForeignKeyInfo GetForeignKeyInfo(Type childType)
    {
        var entityType = _context.Model.FindEntityType(childType);
        var fk = entityType.GetForeignKeys().First();
        var fkProperty = fk.Properties.First();

        return new ForeignKeyInfo
        {
            MotherTable = fk.PrincipalEntityType.ClrType.Name,
            ForeignKeyProperty = fkProperty.Name,
            CsvColumnName = fkProperty.GetColumnName(), // "Number" depuis la configuration EF
            MotherKeyProperty = fk.PrincipalKey.Properties.First().GetColumnName() // "campaign_number"
        };
    }

    private async Task<object> ResolveMotherEntityAsync(
        CsvReader csv, 
        ForeignKeyInfo fkInfo, 
        string fileName, 
        int line, 
        List<string> errors, 
        CancellationToken ct)
    {
        try
        {
            // On détermine le nom de la colonne à utiliser dans le CSV pour retrouver la mère.
            // Par défaut, fkInfo.CsvColumnName peut être "CampaignId", or le CSV de la fille ne contient pas cette colonne.
            // Si la colonne n'est pas présente, on utilise "Number" qui correspond à la valeur servant de lien.
            string csvField = fkInfo.CsvColumnName;
            if (!csv.Context.Reader.HeaderRecord.Contains(csvField))
            {
                // Si le nom contient un underscore, on prend la partie après l'underscore
                if (csvField.Contains("_"))
                {
                    csvField = csvField.Split('_')[1];
                }
                else
                {
                    // Sinon, on utilise "Number" par défaut
                    csvField = "Number";
                }
            }
            
            // Récupère la valeur dans le CSV à partir du champ déterminé
            var keyValue = csv.GetField(csvField);
            if (string.IsNullOrWhiteSpace(keyValue))
            {
                errors.Add($"Fichier {fileName}, ligne {line}: Valeur pour '{csvField}' manquante.");
                return null;
            }
            
            // Dans la table mère, la colonne correspondante est "Number" (même si dans le CSV mère elle s'appelle par exemple "CampaignId")
            string motherProperty = "Number";

            // On parcourt les types d'entités du modèle qui possèdent une propriété "Number"
            var candidateMotherTypes = _context.Model.GetEntityTypes()
                .Select(e => e.ClrType)
                .Where(t => t.GetProperties().Any(p =>
                            string.Equals(p.Name, motherProperty, StringComparison.OrdinalIgnoreCase)))
                .ToList();

            // Parcourt chaque type candidat pour tenter de trouver une correspondance
            foreach (var motherType in candidateMotherTypes)
            {
                // Récupère la propriété "Number" dans la table mère
                var matchingProp = motherType.GetProperties()
                    .FirstOrDefault(p =>
                        string.Equals(p.Name, motherProperty, StringComparison.OrdinalIgnoreCase));
                if (matchingProp == null)
                    continue;

                // Accède au DbSet correspondant en filtrant sur les méthodes déclarées directement dans DbContext
                var setMethod = typeof(DbContext)
                    .GetMethods(BindingFlags.Public | BindingFlags.Instance | BindingFlags.DeclaredOnly)
                    .Single(m => m.Name == nameof(DbContext.Set) && m.IsGenericMethod && m.GetParameters().Length == 0)
                    .MakeGenericMethod(motherType);
                var dbSet = (IQueryable)setMethod.Invoke(_context, null);

                // Construit l'expression lambda : e => e.Number == keyValue
                var param = Expression.Parameter(motherType, "e");
                var prop = Expression.Property(param, matchingProp.Name);
                var convertedKeyValue = Convert.ChangeType(keyValue, matchingProp.PropertyType);
                var lambda = Expression.Lambda(Expression.Equal(prop, Expression.Constant(convertedKeyValue)), param);

                // Applique le filtre via Queryable.Where
                var whereMethod = typeof(Queryable)
                    .GetMethods(BindingFlags.Public | BindingFlags.Static)
                    .Where(m => m.Name == nameof(Queryable.Where) && m.GetParameters().Length == 2)
                    .First()
                    .MakeGenericMethod(motherType);
                var filteredQuery = (IQueryable)whereMethod.Invoke(null, new object[] { dbSet, lambda });

                // Récupère la première entité correspondante via FirstOrDefaultAsync
                var firstOrDefaultMethod = typeof(EntityFrameworkQueryableExtensions)
                    .GetMethods(BindingFlags.Public | BindingFlags.Static)
                    .Where(m => m.Name == nameof(EntityFrameworkQueryableExtensions.FirstOrDefaultAsync)
                        && m.GetParameters().Length == 2)
                    .First()
                    .MakeGenericMethod(motherType);
                var resultTask = (Task)firstOrDefaultMethod.Invoke(null, new object[] { filteredQuery, ct });
                await resultTask.ConfigureAwait(false);
                var result = resultTask.GetType().GetProperty("Result")?.GetValue(resultTask);

                if (result != null)
                {
                    // Une correspondance a été trouvée : on retourne l'entité mère.
                    return result;
                }
            }

            // Aucune entité mère correspondante n'a été trouvée
            errors.Add($"Fichier {fileName}, ligne {line}: Aucune entité mère correspondante trouvée pour la valeur '{keyValue}'.");
            return null;
        }
        catch (Exception ex)
        {
            errors.Add($"Erreur ligne {line}: {ex.Message}");
            return null;
        }
    }
    
    private async Task<object> CreateNewMotherEntity(Type motherType, string keyProperty, object keyValue, CancellationToken ct)
    {
        var entity = Activator.CreateInstance(motherType);
    
        // Set the key property from CSV
        motherType.GetProperty(keyProperty)?.SetValue(entity, keyValue);
    
        // Ensure ID is generated if it's a Guid
        var idProperty = motherType.GetProperty("Id");
        if (idProperty != null && idProperty.PropertyType == typeof(Guid))
        {
            idProperty.SetValue(entity, Guid.NewGuid());
        }
    
        _context.Add(entity);
        await _context.SaveChangesAsync(ct);
        return entity;
    }

    private async Task GenerateFromSeeder(string tableName)
    {
        try
        {
            // Resolve the seeder type
            var seederType = Type.GetType($"Infrastructure.SeedManager.Demos.{tableName}Seeder, Infrastructure");
            if (seederType == null)
            {
                throw new InvalidOperationException($"Seeder for {tableName} not found");
            }

            // Retrieve the seeder instance from the same service provider scope
            var seeder = _serviceProvider.GetRequiredService(seederType);

            // Execute the seeder's GenerateData method
            var method = seederType.GetMethod("GenerateDataAsync") ?? seederType.GetMethod("GenerateData");
            if (method == null)
            {
                throw new InvalidOperationException("GenerateData method not found");
            }

            if (method.Invoke(seeder, null) is Task task)
            {
                await task;
                await _context.SaveChangesAsync(); // Save changes to the main DbContext
            }
        }
        catch (Exception ex)
        {
            throw new InvalidOperationException($"Error with {tableName}Seeder: {ex.Message}", ex);
        }
    }

    private void SetForeignKey(object childEntity, ForeignKeyInfo fkInfo, object motherEntity)
    {
        var fkProp = childEntity.GetType().GetProperty(fkInfo.ForeignKeyProperty);
        if (fkProp == null) return;
    
        var motherIdProp = motherEntity.GetType().GetProperty("Id");
        if (motherIdProp == null) return;
    
        var motherId = motherIdProp.GetValue(motherEntity);
        if (motherId != null)
        {
            fkProp.SetValue(childEntity, motherId);
        }
    }

    private class ForeignKeyInfo
    {
        public string MotherTable { get; set; }
        public string ForeignKeyProperty { get; set; }
        public string MotherKeyProperty { get; set; }
        public string CsvColumnName { get; set; } // Nouveau
        public Type ChildType { get; set; }
    }
}
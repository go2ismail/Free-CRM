using System.Globalization;
using System.IO;
using System.Linq;
using System.Reflection;
using Microsoft.Extensions.Options;
using Microsoft.AspNetCore.Identity;
using Application.Common.Repositories;
using Application.Common.Services.CSVManager;
using Domain.Common;
using Infrastructure.SecurityManager.AspNetIdentity;
using Infrastructure.SecurityManager.Roles;
using Infrastructure.SeedManager.Systems;

namespace Infrastructure.CSVManager
{
    public class CsvImportService : ICsvImportService
    {
        private readonly IServiceProvider _serviceProvider;
        private readonly IUnitOfWork _unitOfWork;
        private readonly CSVSettings _csvSettings;
        private readonly RoleManager<IdentityRole> _roleManager;
        private readonly UserManager<ApplicationUser> _userManager;

        public CsvImportService(IServiceProvider serviceProvider, IUnitOfWork unitOfWork, IOptions<CSVSettings> csvSettings, 
                                RoleManager<IdentityRole> roleManager, UserManager<ApplicationUser> userManager)
        {
            _serviceProvider = serviceProvider;
            _unitOfWork = unitOfWork;
            _csvSettings = csvSettings.Value;
            _roleManager = roleManager;
            _userManager = userManager;
        }

        public async Task ImportCsvAsync<T>(string filePath, string entityTypeName, Dictionary<string, string> columnMappings, string separator = ",") where T : class
        {
            separator ??= _csvSettings.Separator; 

            if (entityTypeName == "UserManager")
            {
                await ImportUsersFromCsv(filePath, columnMappings, separator);
                return;
            }
            if (entityTypeName == "RoleManager")
            {
                await ImportRolesFromCsv(filePath, columnMappings, separator);
                return;
            }

            var entityType = Assembly.GetAssembly(typeof(BaseEntity))
                .GetTypes()
                .FirstOrDefault(t => t.Name == entityTypeName && t.IsClass && !t.IsAbstract && typeof(BaseEntity).IsAssignableFrom(t) && t != typeof(BaseEntity));
            
            if (entityType == null)
                throw new Exception($"Entity {entityTypeName} not found");

            var repositoryType = typeof(ICommandRepository<>).MakeGenericType(entityType);
            var repository = _serviceProvider.GetService(repositoryType);
            if (repository == null)
                throw new Exception($"Repository for {entityTypeName} not found");

            using (var reader = new StreamReader(filePath))
            {
                var headers = reader.ReadLine()?.Split(separator);

                if (headers == null)
                    throw new Exception("The CSV file is empty or has no headers.");

                var records = new List<Dictionary<string, string>>();
                string line;

                while ((line = reader.ReadLine()) != null)
                {
                    var values = line.Split(separator);
                    var record = new Dictionary<string, string>();

                    for (int i = 0; i < headers.Length; i++)
                    {
                        if (i < values.Length)
                            record[headers[i]] = values[i];
                    }

                    records.Add(record);
                }

                foreach (var record in records)
                {
                    var entity = Activator.CreateInstance(entityType);
                    foreach (var mapping in columnMappings)
                    {
                        var csvColumn = mapping.Key;
                        var entityProperty = mapping.Value;

                        var property = entityType.GetProperty(entityProperty);
                        if (property != null && record.ContainsKey(csvColumn))
                        {
                            try
                            {
                                var value = CsvHelperExtensions.ConvertToType(record[csvColumn], property.PropertyType);
                                property.SetValue(entity, value);
                            }
                            catch (Exception ex)
                            {
                                Console.WriteLine($"Error converting value for {csvColumn}: {ex.Message}");
                            }
                        }
                    }

                    try
                    {
                        repository.GetType().GetMethod("Create")?.Invoke(repository, new object[] { entity });
                    }
                    catch (Exception ex)
                    {
                        Console.WriteLine($"Error inserting entity: {ex.Message}");
                    }
                }
            }

            await _unitOfWork.SaveAsync();
        }

        public async Task ImportUsersFromCsv(string filePath, Dictionary<string, string> columnMappings, string separator)
        {
            using (var reader = new StreamReader(filePath))
            {
                var headers = reader.ReadLine()?.Split(separator);

                if (headers == null)
                    throw new Exception("The CSV file is empty or has no headers.");

                string line;
                while ((line = reader.ReadLine()) != null)
                {
                    var values = line.Split(separator);
                    var record = new Dictionary<string, string>();

                    for (int i = 0; i < headers.Length; i++)
                    {
                        if (i < values.Length)
                            record[headers[i]] = values[i];
                    }

                    var email = record.ContainsKey("Email") ? record["Email"] : null;
                    var firstName = record.ContainsKey("FirstName") ? record["FirstName"] : "User";
                    var lastName = record.ContainsKey("LastName") ? record["LastName"] : "Default";
                    var password = record.ContainsKey("Password") ? record["Password"] : "Password@123";

                    if (string.IsNullOrEmpty(email)) continue;

                    var existingUser = await _userManager.FindByEmailAsync(email);
                    if (existingUser == null)
                    {
                        var user = new ApplicationUser(email, firstName, lastName)
                        {
                            EmailConfirmed = true
                        };

                        await _userManager.CreateAsync(user, password);

                        var roles = RoleHelper.GetAdminRoles();
                        foreach (var role in roles)
                        {
                            if (!await _userManager.IsInRoleAsync(user, role))
                            {
                                await _userManager.AddToRoleAsync(user, role);
                            }
                        }
                    }
                }
            }
        }

        public async Task ImportRolesFromCsv(string filePath, Dictionary<string, string> columnMappings, string separator)
        {
            using (var reader = new StreamReader(filePath))
            {
                var headers = reader.ReadLine()?.Split(separator);

                if (headers == null)
                    throw new Exception("The CSV file is empty or has no headers.");

                string line;
                while ((line = reader.ReadLine()) != null)
                {
                    var values = line.Split(separator);
                    var record = new Dictionary<string, string>();

                    for (int i = 0; i < headers.Length; i++)
                    {
                        if (i < values.Length)
                            record[headers[i]] = values[i];
                    }

                    var roleName = record.ContainsKey("RoleName") ? record["RoleName"] : null;
                    if (string.IsNullOrEmpty(roleName)) continue;

                    if (!await _roleManager.RoleExistsAsync(roleName))
                    {
                        await _roleManager.CreateAsync(new IdentityRole(roleName));
                    }
                }
            }
        }
    }
}

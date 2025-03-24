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

        public CsvImportService(IServiceProvider serviceProvider, IUnitOfWork unitOfWork,
            IOptions<CSVSettings> csvSettings,
            RoleManager<IdentityRole> roleManager, UserManager<ApplicationUser> userManager)
        {
            _serviceProvider = serviceProvider;
            _unitOfWork = unitOfWork;
            _csvSettings = csvSettings.Value;
            _roleManager = roleManager;
            _userManager = userManager;
        }

        public async Task ImportCsvAsync<T>(string filePath, string entityTypeName, string separator = ",")
            where T : class
        {
            try
            {
                if (entityTypeName == "UserManager")
                {
                    await ImportUsersFromCsv(filePath, separator);
                    await _unitOfWork.SaveAsync();
                    return;
                }

                if (entityTypeName == "RoleManager")
                {
                    await ImportRolesFromCsv(filePath, separator);
                    await _unitOfWork.SaveAsync();
                    return;
                }

                var entityType = Assembly.GetAssembly(typeof(BaseEntity))
                    .GetTypes()
                    .FirstOrDefault(t =>
                        t.Name == entityTypeName && t.IsClass && !t.IsAbstract &&
                        typeof(BaseEntity).IsAssignableFrom(t) && t != typeof(BaseEntity));

                if (entityType == null)
                    throw new Exception($"Entity {entityTypeName} not found");

                var repositoryType = typeof(ICommandRepository<>).MakeGenericType(entityType);
                var repository = _serviceProvider.GetService(repositoryType);
                if (repository == null)
                    throw new Exception($"Repository for {entityTypeName} not found");

                var entities = new List<object>(); // Liste temporaire pour stocker les entités créées

                using (var reader = new StreamReader(filePath))
                {
                    var headers = reader.ReadLine()?.Split(separator);
                    if (headers == null)
                        throw new Exception("The CSV file is empty or has no headers.");

                    // Récupération des propriétés de l'entité (insensibles à la casse)
                    var properties = entityType.GetProperties().ToDictionary(p => p.Name.ToLower(), p => p);

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

                        var entity = Activator.CreateInstance(entityType);
                        foreach (var header in headers)
                        {
                            var columnName = header.ToLower();
                            if (properties.TryGetValue(columnName, out var property))
                            {
                                try
                                {
                                    var value = CsvHelperExtensions.ConvertToType(record[header],
                                        property.PropertyType);
                                    property.SetValue(entity, value);
                                }
                                catch (Exception ex)
                                {
                                    throw new Exception($"Error converting value for column '{header}': {ex.Message}");
                                }
                            }
                        }

                        try
                        {
                            repository.GetType().GetMethod("Create")?.Invoke(repository, new object[] { entity });
                            entities.Add(entity);
                        }
                        catch (Exception ex)
                        {
                            throw new Exception($"Error inserting entity: {ex.Message}");
                        }
                    }
                }

                if (entities.Any())
                {
                    await _unitOfWork.SaveAsync();
                }
            }
            catch (Exception)
            {
                throw;
            }
        }


        public async Task ImportUsersFromCsv(string filePath, string separator)
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
                            record[headers[i].ToLower()] =
                                values[i]; // On stocke en lowercase pour correspondance insensible à la casse
                    }

                    // Vérification des champs obligatoires
                    if (!record.TryGetValue("email", out var email) || string.IsNullOrEmpty(email))
                        continue;

                    var firstName = record.GetValueOrDefault("firstname", "User");
                    var lastName = record.GetValueOrDefault("lastname", "Default");
                    var password = record.GetValueOrDefault("password", "Password@123");

                    var existingUser = await _userManager.FindByEmailAsync(email);
                    if (existingUser == null)
                    {
                        var user = new ApplicationUser(email, firstName, lastName)
                        {
                            EmailConfirmed = true
                        };

                        await _userManager.CreateAsync(user, password);

                        // Ajout automatique de l'utilisateur aux rôles admin
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
        
        
        public async Task ImportRolesFromCsv(string filePath, string separator)
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
                            record[headers[i].ToLower()] = values[i]; // Insensible à la casse
                    }

                    if (!record.TryGetValue("rolename", out var roleName) || string.IsNullOrEmpty(roleName))
                        continue;

                    if (!await _roleManager.RoleExistsAsync(roleName))
                    {
                        await _roleManager.CreateAsync(new IdentityRole(roleName));
                    }
                }
            }
        }

    }
}

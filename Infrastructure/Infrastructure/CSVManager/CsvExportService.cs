using System;
using System.Collections.Generic;
using System.Globalization;
using System.IO;
using System.Linq;
using System.Reflection;
using System.Text;
using System.Threading.Tasks;
using Application.Common.Repositories;
using Application.Common.Services.CSVManager;
using Domain.Common;
using Infrastructure.SecurityManager.AspNetIdentity;
using Infrastructure.SecurityManager.Roles;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.DependencyInjection;

namespace Infrastructure.CSVManager
{
    public class CsvExportService : ICsvExportService
    {
        private readonly IServiceProvider _serviceProvider;
        private readonly IUnitOfWork _unitOfWork;
        private readonly RoleManager<IdentityRole> _roleManager;
        private readonly UserManager<ApplicationUser> _userManager;

        public CsvExportService(IServiceProvider serviceProvider, IUnitOfWork unitOfWork,
            RoleManager<IdentityRole> roleManager, UserManager<ApplicationUser> userManager)
        {
            _serviceProvider = serviceProvider;
            _unitOfWork = unitOfWork;
            _roleManager = roleManager;
            _userManager = userManager;
        }

        public async Task ExportCsvAsync(string entityTypeName, string filePath, string separator = ",")
        {
            try
            {
                List<object> data = entityTypeName switch
                {
                    "UserManager" => await ExportUsersAsync(),
                    "RoleManager" => await ExportRolesAsync(),
                    _ => await ExportEntitiesAsync(entityTypeName)
                };

                if (data == null || !data.Any())
                    throw new Exception($"No data found for  {entityTypeName}.");

                await WriteCsvFileAsync(data, entityTypeName, separator);
            }
            catch (Exception ex)
            {
                throw new Exception($"Error exporting {entityTypeName}: {ex.Message}");
            }
        }

        private async Task<List<object>> ExportUsersAsync()
        {
            var users = _userManager.Users.ToList();
            return users.Cast<object>().ToList();
        }

        private async Task<List<object>> ExportRolesAsync()
        {
            var roles = _roleManager.Roles.ToList();
            return roles.Cast<object>().ToList();
        }

        private async Task<List<object>> ExportEntitiesAsync(string entityTypeName)
        {
            var entityType = Assembly.GetAssembly(typeof(BaseEntity))
                .GetTypes()
                .FirstOrDefault(t => t.Name == entityTypeName && typeof(BaseEntity).IsAssignableFrom(t));

            if (entityType == null)
                throw new Exception($"Entity {entityTypeName} not found");

            var repositoryType = typeof(ICommandRepository<>).MakeGenericType(entityType);
            var repository = _serviceProvider.GetService(repositoryType);
            if (repository == null)
                throw new Exception($"Repository for {entityTypeName} not found");

            var getQueryMethod = repository.GetType().GetMethod("GetQuery");
            if (getQueryMethod == null)
                throw new Exception($"GetQuery method not found on {entityTypeName} repository");

            var queryable = getQueryMethod.Invoke(repository, null) as IQueryable<object>;
            return queryable?.ToList() ?? new List<object>();
        }

        private async Task WriteCsvFileAsync(List<object> data, string entityTypeName, string separator)
        {
            var entityType = data.First().GetType();
            var properties = entityType.GetProperties(BindingFlags.Public | BindingFlags.Instance);
            var validProperties = properties
                .Where(p => 
                    !(p.PropertyType.IsGenericType && 
                      (typeof(System.Collections.Generic.List<>).IsAssignableFrom(p.PropertyType.GetGenericTypeDefinition()) ||
                       typeof(System.Collections.Generic.ICollection<>).IsAssignableFrom(p.PropertyType.GetGenericTypeDefinition()))) &&
                    !typeof(BaseEntity).IsAssignableFrom(p.PropertyType)
                )
                .ToList();

            // Construction dynamique du chemin du fichier
            string filePath = Path.Combine("C:/Users/user/Documents/", $"{entityTypeName}.csv");

            // Vérifier si le répertoire existe, sinon créer le répertoire
            string directory = Path.GetDirectoryName(filePath);
            if (!Directory.Exists(directory))
            {
                Directory.CreateDirectory(directory);
            }

            // Construction du CSV
            var sb = new StringBuilder();
            sb.AppendLine(string.Join(separator, validProperties.Select(p => p.Name)));

            foreach (var item in data)
            {
                var values = validProperties.Select(p => FormatValue(p.GetValue(item), p.PropertyType, separator));
                sb.AppendLine(string.Join(separator, values));
            }

            // Écriture du fichier CSV
            await File.WriteAllTextAsync(filePath, sb.ToString(), Encoding.UTF8);
        }


        private string FormatValue(object value, Type propertyType, string separator)
        {
            if (value == null) return "";

            if (propertyType.IsEnum)
                return Convert.ToInt32(value).ToString();

            if (value is DateTime dateTime)
                return dateTime.ToString("yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture);

            if (value is bool boolean)
                return boolean ? "true" : "false";

            if (value is string str)
            {
                if (str.Contains(separator) || str.Contains("\""))
                    return $"\"{str.Replace("\"", "\"\"")}\"";
            }

            return value.ToString();
        }
    }
}

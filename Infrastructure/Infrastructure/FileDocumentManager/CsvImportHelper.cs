using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Dynamic;
using System.Globalization;
using System.IO;
using System.Linq;
using System.Reflection;
using System.Text;
using System.Text.RegularExpressions;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.FileDocumentManager
{
    public static class CsvImportHelper
    {
        public static bool IsSectionLine(string line, out string sectionName)
        {
            sectionName = null;
            line = line.Trim();
            
            if (line.StartsWith("[") && line.EndsWith("]"))
            {
                sectionName = line.Substring(1, line.Length - 2).Trim();
                return true;
            }
            if ((line.StartsWith("\"") && line.EndsWith("\"")) || 
                (line.StartsWith("'") && line.EndsWith("'")))
            {
                sectionName = line.Substring(1, line.Length - 2).Trim();
                return true;
            }
            
            if (Regex.IsMatch(line, @"^[a-zA-Z0-9_]+$"))
            {
                sectionName = line;
                return true;
            }
            
            return false;
        }

        public static Type FindEntityType(string tableName)
        {
            var allTypes = AppDomain.CurrentDomain.GetAssemblies()
                .Where(a => !a.IsDynamic)
                .SelectMany(a => a.GetTypes());

            var entityType = allTypes.FirstOrDefault(t => 
                t.Name.Equals(tableName, StringComparison.OrdinalIgnoreCase));
            
            entityType ??= allTypes.FirstOrDefault(t => 
                t.Name.Equals($"{tableName}Entity", StringComparison.OrdinalIgnoreCase));
            
            entityType ??= allTypes.FirstOrDefault(t => 
                t.Name.Equals($"I{tableName}", StringComparison.OrdinalIgnoreCase));

            return entityType;
        }
        
        public static bool IsValidEntityType(DbContext context, Type type)
        {
            var dbSetProperties = context.GetType().GetProperties()
                .Where(p => p.PropertyType.IsGenericType && 
                            p.PropertyType.GetGenericTypeDefinition() == typeof(DbSet<>));

            return dbSetProperties.Any(p => p.PropertyType.GetGenericArguments()[0] == type);
        }

        public static object GetDbSetForEntity(DbContext context, Type entityType)
        {
            var method = typeof(DbContext).GetMethod("Set", Type.EmptyTypes);
            return method.MakeGenericMethod(entityType).Invoke(context, null);
        }
        
        public static void SetPropertyValue(object entity, Type entityType, string propertyName, object value, bool allowPrimaryKeyInsert = false)
        {
            var prop = entityType.GetProperty(propertyName, BindingFlags.IgnoreCase | BindingFlags.Public | BindingFlags.Instance);
            if (prop == null || !prop.CanWrite)
                return;

            // Vérifie si c'est une clé primaire
            var isPrimaryKey = prop.GetCustomAttribute<KeyAttribute>() != null || 
                               string.Equals(prop.Name, "Id", StringComparison.OrdinalIgnoreCase);

            if (isPrimaryKey && !allowPrimaryKeyInsert)
            {
                // Ne pas modifier les clés primaires sauf si explicitement autorisé
                return;
            }

            try
            {
                object convertedValue = ConvertValue(prop.PropertyType, value);
                prop.SetValue(entity, convertedValue);
            }
            catch (Exception ex)
            {
                throw new Exception($"Failed to convert value '{value}' for property '{propertyName}'. Error: {ex.Message}");
            }
        }

        private static object ConvertValue(Type targetType, object value)
        {
            bool isNullable = targetType.IsGenericType && targetType.GetGenericTypeDefinition() == typeof(Nullable<>);
            Type underlyingType = isNullable ? Nullable.GetUnderlyingType(targetType) : targetType;

            string stringValue = value?.ToString().Trim();
            
            if (string.IsNullOrEmpty(stringValue))
            {
                if (isNullable || !targetType.IsValueType)
                    return null;
                
                throw new Exception($"Field cannot be null or empty.");
            }

            if (underlyingType == typeof(DateTime))
                return ConvertToDateTime(stringValue);
            
            if (underlyingType == typeof(Guid))
                return Guid.Parse(stringValue);
            
            if (underlyingType == typeof(bool))
                return ConvertToBoolean(stringValue);
            
            if (underlyingType.IsEnum)
                return Enum.Parse(underlyingType, stringValue, true);
            
            if (underlyingType == typeof(decimal))
                return decimal.Parse(stringValue, NumberStyles.Any, CultureInfo.InvariantCulture);
            
            if (underlyingType == typeof(double))
                return double.Parse(stringValue,NumberStyles.Any, CultureInfo.InvariantCulture);
            
            if (underlyingType == typeof(float))
                return float.Parse(stringValue,NumberStyles.Any, CultureInfo.InvariantCulture);
            
            if (underlyingType == typeof(int))
                return int.Parse(stringValue,NumberStyles.Any,  CultureInfo.InvariantCulture);
            
            if (underlyingType == typeof(string))
                return stringValue;

            return Convert.ChangeType(stringValue, underlyingType);
        }

        private static DateTime ConvertToDateTime(string stringValue)
        {
            var dateFormats = new[] {
                "MM/dd/yyyy HH:mm:ss", "MM/dd/yyyy hh:mm:ss tt", "M/d/yyyy HH:mm:ss",
                "dd-MM-yyyy HH:mm:ss", "dd/MM/yyyy HH:mm:ss", "yyyy-MM-dd HH:mm:ss",
                "MM/dd/yyyy", "dd-MM-yyyy", "yyyy-MM-dd", "dd/MM/yyyy",
                "yyyy-MM-ddTHH:mm:ssZ", "yyyy-MM-ddTHH:mm:ss.fffZ",
                "yyyyMMdd", "ddMMyyyy", "MMddyyyy"
            };

            if (DateTime.TryParseExact(stringValue, dateFormats, CultureInfo.InvariantCulture,
                    DateTimeStyles.AllowWhiteSpaces | DateTimeStyles.AssumeLocal, out var parsedDate) ||
                DateTime.TryParse(stringValue, CultureInfo.InvariantCulture, 
                    DateTimeStyles.AllowWhiteSpaces | DateTimeStyles.AssumeLocal, out parsedDate))
            {
                return DateTime.SpecifyKind(parsedDate, DateTimeKind.Unspecified);
            }

            throw new FormatException($"Invalid date format: '{stringValue}'");
        }

        private static bool ConvertToBoolean(string stringValue)
        {
            if (bool.TryParse(stringValue, out bool result))
                return result;

            switch (stringValue.ToLower())
            {
                case "yes": case "y": case "oui": case "o": case "1": case "true": case "vrai":
                    return true;
                case "no": case "n": case "non": case "0": case "false": case "faux":
                    return false;
                default:
                    throw new FormatException($"Invalid boolean value: '{stringValue}'");
            }
        }
        public class ForeignKeyInfo
        {
            public PropertyInfo Property { get; set; }
            public PropertyInfo NavigationProperty { get; set; }
            public Type TargetType { get; set; }
        }

        public static PropertyInfo GetPrimaryKeyProperty(Type entityType)
        {
            return entityType.GetProperties()
                .FirstOrDefault(p => p.Name.Equals("Id", StringComparison.OrdinalIgnoreCase) || 
                                   p.GetCustomAttribute<KeyAttribute>() != null)
                ?? throw new Exception($"No primary key found for type {entityType.Name}");
        }

        public static bool IsForeignKeyProperty(Type entityType, string propertyName, out ForeignKeyInfo info)
        {
            info = null;
            var property = entityType.GetProperty(propertyName);
            if (property == null) return false;

            // Check for explicit ForeignKey attribute or conventional naming
            var foreignKeyAttr = property.GetCustomAttribute<ForeignKeyAttribute>();
            if (foreignKeyAttr != null || propertyName.EndsWith("Id", StringComparison.OrdinalIgnoreCase))
            {
                var navigationProperty = entityType.GetProperties()
                    .FirstOrDefault(p => p.GetCustomAttribute<ForeignKeyAttribute>()?.Name == propertyName || 
                                         p.Name == propertyName.Replace("Id", "", StringComparison.OrdinalIgnoreCase));

                info = new ForeignKeyInfo 
                {
                    Property = property,
                    NavigationProperty = navigationProperty,
                    TargetType = navigationProperty?.PropertyType ?? GetUnderlyingType(property.PropertyType)
                };

                return true;
            }

            return false;
        }

        public static void HandleForeignKey(
            object entity, 
            ForeignKeyInfo fkInfo, 
            object value, 
            Dictionary<string, Dictionary<object, object>> importedEntities,
            DbContext context = null,
            bool allowPrimaryKeyInsert = false)
        {
            if (value == null || string.IsNullOrWhiteSpace(value.ToString()))
            {
                fkInfo.Property.SetValue(entity, null);
                if (fkInfo.NavigationProperty != null)
                    fkInfo.NavigationProperty.SetValue(entity, null);
                return;
            }

            // Try to find referenced entity in already imported entities
            var targetTypeName = fkInfo.TargetType.Name;
            if (importedEntities.TryGetValue(targetTypeName, out var targetEntities) && 
                targetEntities.TryGetValue(value, out var targetEntity))
            {
                SetForeignKeyValue(entity, fkInfo, GetPrimaryKeyValue(targetEntity), targetEntity);
                return;
            }
            
            if (IsPrimaryKey(fkInfo.Property) && !allowPrimaryKeyInsert)
            {
                return;
            }

            // If not found in imported entities, try to load from database if context is available
            if (context != null)
            {
                var targetEntityFromDb = TryLoadEntityFromDatabase(context, fkInfo.TargetType, value);
                if (targetEntityFromDb != null)
                {
                    SetForeignKeyValue(entity, fkInfo, value, targetEntityFromDb);
                    return;
                }
            }

            throw new Exception($"Referenced entity of type {targetTypeName} with key {value} not found. " +
                             "Make sure to import referenced tables first or ensure it exists in database.");
        }
        
        private static bool IsPrimaryKey(PropertyInfo property)
        {
            return property.GetCustomAttribute<KeyAttribute>() != null || 
                   string.Equals(property.Name, "Id", StringComparison.OrdinalIgnoreCase);
        }

        private static void SetForeignKeyValue(object entity, ForeignKeyInfo fkInfo, object keyValue, object targetEntity)
        {
            // Convert key value to proper type
            var convertedKeyValue = Convert.ChangeType(keyValue, fkInfo.Property.PropertyType);
            fkInfo.Property.SetValue(entity, convertedKeyValue);

            // Set navigation property if exists
            if (fkInfo.NavigationProperty != null)
            {
                fkInfo.NavigationProperty.SetValue(entity, targetEntity);
            }
        }

        private static object TryLoadEntityFromDatabase(DbContext context, Type entityType, object keyValue)
        {
            var dbSetMethod = typeof(DbContext).GetMethod(nameof(DbContext.Set), Type.EmptyTypes)
                ?.MakeGenericMethod(entityType);
            
            var dbSet = dbSetMethod?.Invoke(context, null);
            var findMethod = dbSet?.GetType().GetMethod(nameof(DbSet<object>.Find), new[] { typeof(object) });

            try
            {
                return findMethod?.Invoke(dbSet, new[] { keyValue });
            }
            catch
            {
                return null;
            }
        }

        private static Type GetUnderlyingType(Type type)
        {
            return Nullable.GetUnderlyingType(type) ?? type;
        }

        public static object GetPrimaryKeyValue(object entity)
        {
            var keyProperty = GetPrimaryKeyProperty(entity.GetType());
            return keyProperty.GetValue(entity);
        }

        public static object GetPropertyValue(object obj, string propertyName)
        {
            return obj.GetType().GetProperty(propertyName)?.GetValue(obj);
        }
        
        private static decimal ConvertDecimal(string stringValue)
        {
            // Permettre à la fois les formats avec . et ,
            if (decimal.TryParse(stringValue, NumberStyles.Any, CultureInfo.InvariantCulture, out var result))
            {
                return result;
            }

            // Essayer avec la culture française si l'invariant échoue
            if (decimal.TryParse(stringValue, NumberStyles.Any, CultureInfo.GetCultureInfo("fr-FR"), out result))
            {
                return result;
            }

            throw new FormatException($"Format décimal invalide : '{stringValue}'");
        }
    }
}
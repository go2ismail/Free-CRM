using System;
using System.Globalization;

namespace Infrastructure.CSVManager
{
    public static class CsvHelperExtensions
    {
        public static object ConvertToType(string value, Type targetType)
        {
            if (string.IsNullOrEmpty(value)) return null;  

            if (targetType == typeof(int))
                return int.TryParse(value, out var intValue) ? intValue : default;
            if (targetType == typeof(long))
                return long.TryParse(value, out var longValue) ? longValue : default;
            if (targetType == typeof(double))
                return double.TryParse(value, out var doubleValue) ? doubleValue : default;
            if (targetType == typeof(float))
                return float.TryParse(value, out var floatValue) ? floatValue : default;
            if (targetType == typeof(bool))
                return bool.TryParse(value, out var boolValue) ? boolValue : default;

            if (targetType == typeof(DateTime) || targetType == typeof(DateTime?))
            {
                string[] formats = new[]
                {
                    "yyyy-MM-dd HH:mm:ss", 
                    "yyyy-MM-dd",          
                    "MM/dd/yyyy",          
                    "dd/MM/yyyy",        
                    "yyyy/MM/dd"          
                };

                if (DateTime.TryParseExact(value, formats, CultureInfo.InvariantCulture, DateTimeStyles.None, out var dateValue))
                {
                    return dateValue;
                }

                return null; 
            }

            if (targetType == typeof(string))
                return value;

            if (targetType.IsGenericType && targetType.GetGenericTypeDefinition() == typeof(Nullable<>))
            {
                var underlyingType = Nullable.GetUnderlyingType(targetType);
                return Convert.ChangeType(value, underlyingType);
            }

            throw new InvalidCastException($"Cannot convert value '{value}' to type {targetType.FullName}");
        }
    }
}

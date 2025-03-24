using System;
using System.Globalization;

namespace Infrastructure.CSVManager
{
    public static class CsvHelperExtensions
    {
        public static object ConvertToType(string value, Type targetType)
        {
            if (string.IsNullOrWhiteSpace(value)) return null;

            targetType = Nullable.GetUnderlyingType(targetType) ?? targetType;

            try
            {
                if (targetType.IsEnum)
                {
                    // Essaye de convertir à partir d'un entier ou d'un nom d'enum
                    if (int.TryParse(value, out var intValue))
                        return Enum.ToObject(targetType, intValue);
                    if (Enum.TryParse(targetType, value, true, out var enumValue))
                        return enumValue;
                    
                    throw new InvalidCastException($"Invalid enum value '{value}' for {targetType.Name}");
                }

                if (targetType == typeof(int)) return int.Parse(value, CultureInfo.InvariantCulture);
                if (targetType == typeof(long)) return long.Parse(value, CultureInfo.InvariantCulture);
                if (targetType == typeof(double)) return double.Parse(value, CultureInfo.InvariantCulture);
                if (targetType == typeof(float)) return float.Parse(value, CultureInfo.InvariantCulture);
                if (targetType == typeof(bool)) return bool.Parse(value);
                if (targetType == typeof(string)) return value.Trim();

                if (targetType == typeof(DateTime))
                {
                    string[] formats = {
                        "yyyy-MM-dd HH:mm:ss", "yyyy-MM-dd", "MM/dd/yyyy", 
                        "dd/MM/yyyy", "yyyy/MM/dd", "dd/MM/yyyy HH:mm:ss", 
                        "MM/dd/yyyy HH:mm:ss", "yyyy/MM/dd HH:mm:ss"
                    };

                    if (DateTime.TryParseExact(value, formats, CultureInfo.InvariantCulture, DateTimeStyles.None, out var dateValue))
                        return dateValue;

                    throw new FormatException($"Invalid DateTime format: '{value}'");
                }

                return Convert.ChangeType(value, targetType, CultureInfo.InvariantCulture);
            }
            catch (Exception ex)
            {
                throw new InvalidCastException($"Cannot convert value '{value}' to type {targetType.FullName}: {ex.Message}");
            }
        }
    }
}

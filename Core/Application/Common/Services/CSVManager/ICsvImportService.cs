using System.Collections.Generic;
using System.Threading.Tasks;

namespace Application.Common.Services.CSVManager
{
    public interface ICsvImportService
    {
        Task ImportCsvAsync<T>(string filePath, string entityTypeName, Dictionary<string, string> columnMappings, string separator = ",") where T : class;

        Task ImportUsersFromCsv(string filePath, Dictionary<string, string> columnMappings, string separator);
    }
}
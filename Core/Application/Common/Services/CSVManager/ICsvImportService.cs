using System.Collections.Generic;
using System.Threading.Tasks;

namespace Application.Common.Services.CSVManager
{
    public interface ICsvImportService
    {
        Task ImportCsvAsync<T>(string filePath, string entityTypeName, string separator) where T : class;

        Task ImportUsersFromCsv(string filePath, string separator);
    }
}
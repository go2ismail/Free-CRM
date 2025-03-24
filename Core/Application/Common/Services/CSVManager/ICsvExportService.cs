using System.Threading.Tasks;

namespace Application.Common.Services.CSVManager
{
    public interface ICsvExportService
    {
        Task ExportCsvAsync(string entityTypeName, string filePath, string separator = ",");
    }
}
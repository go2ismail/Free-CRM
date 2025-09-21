namespace Application.Common.Services.FileDocumentManager;
public interface ICSVService
{
    Task<Dictionary<string, int>> ImportTablesFromCsvAsync(List<string> tableNames, List<byte[]> csvDataList, string createdById, CancellationToken cancellationToken = default);
}
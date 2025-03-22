namespace Application.Common.Services.FileDocumentManager;
public interface IFileDocumentService
{
    Task<string> UploadAsync(
        string? originalFileName,
        string? docExtension,
        byte[]? fileData,
        long? size,
        string? description = "",
        string? createdById = "",
        CancellationToken cancellationToken = default);

    Task<byte[]> GetFileAsync(string fileName, CancellationToken cancellationToken = default);

    Task<string> ExportTableToCsvAsync(string tableName, CancellationToken cancellationToken = default);

    Task<int> ImportTableFromCsvAsync(string tableName, byte[] csvData, CancellationToken cancellationToken = default);
}
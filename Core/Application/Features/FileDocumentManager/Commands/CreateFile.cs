using Application.Common.Services.FileDocumentManager;
using FluentValidation;
using MediatR;
using System.IO;
using System.Text;

namespace Application.Features.FileFileManager.Queries
{
    public class ImportFileResult
    {
        public string Message { get; init; }
        public int InsertedCount { get; init; } 
    }
    
    public class ImportFileRequest : IRequest<ImportFileResult>
    {
        public string? Name { get; init; }
        public byte[]? CsvData { get; init; }
    }
    
    public class ImportFileDataRequest : IRequest<ImportFileResult>
    {
        public List<byte[]>? CsvData { get; init; }
        public List<string>? FileName { get; init; }
        public string? CreatedById { get; init; }
    }

    public class ImportFileValidator : AbstractValidator<ImportFileRequest>
    {
        public ImportFileValidator()
        {
            RuleFor(x => x.Name)
                .NotEmpty().WithMessage("Table name must not be empty.");
            RuleFor(x => x.CsvData)
                .NotNull().WithMessage("CSV file data must be provided.")
                .Must(data => data.Length > 0).WithMessage("CSV file data must not be empty.");
        }
    }

    public class ImportFileHandler : IRequestHandler<ImportFileRequest, ImportFileResult>
    {
        private readonly IFileDocumentService _fileService;

        public ImportFileHandler(IFileDocumentService fileService)
        {
            _fileService = fileService;
        }

        public async Task<ImportFileResult> Handle(ImportFileRequest request, CancellationToken cancellationToken)
        {
            if (string.IsNullOrWhiteSpace(request.Name) || request.CsvData == null || request.CsvData.Length == 0)
            {
                throw new ArgumentException("Table name and CSV data are required.");
            }

            int insertedCount = await _fileService.ImportTableFromCsvAsync(request.Name, request.CsvData, cancellationToken);

            return new ImportFileResult
            {
                Message = "Insertion réussie.",
                InsertedCount = insertedCount
            };
        }
    }

    public class ImportFileDataHandler : IRequestHandler<ImportFileDataRequest, ImportFileResult>
    {
        private readonly ICSVService _fileService;

        public ImportFileDataHandler(ICSVService fileService)
        {
            _fileService = fileService;
        }

        public async Task<ImportFileResult> Handle(ImportFileDataRequest request, CancellationToken cancellationToken)
        {
            if (request.CsvData == null || request.FileName == null)
            {
                throw new ArgumentException("Both CSV data and table names are required.");
            }

            if (request.CsvData.Count == 0 || request.FileName.Count == 0)
            {
                throw new ArgumentException("CSV data and table names lists cannot be empty.");
            }

            if (request.CsvData.Count != request.FileName.Count)
            {
                throw new ArgumentException("The number of CSV files must match the number of table names.");
            }

            if (request.CsvData.Any(data => data == null || data.Length == 0))
            {
                throw new ArgumentException("One or more CSV files are empty or null.");
            }

            if (request.FileName.Any(string.IsNullOrWhiteSpace))
            {
                throw new ArgumentException("Table names cannot be null or whitespace.");
            }
            
            Dictionary<string, int> importResults = await _fileService.ImportTablesFromCsvAsync(
                request.FileName, 
                request.CsvData, 
                request.CreatedById,
                cancellationToken);

            if (importResults == null || importResults.Count == 0)
            {
                throw new ArgumentException("No data was imported.");
            }

            var sb = new StringBuilder();
            int total = 0;

            foreach (var result in importResults)
            {
                sb.AppendLine($"Table {result.Key} imported successfully! {result.Value} rows inserted.");
                total += result.Value;
            }

            sb.AppendLine($"Total: {total} rows inserted across {importResults.Count} tables.");
    
            return new ImportFileResult
            {
                Message = sb.ToString(),
                InsertedCount = total
            };
        }
    }
    
   
}

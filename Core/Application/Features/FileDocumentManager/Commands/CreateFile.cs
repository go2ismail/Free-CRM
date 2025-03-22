using Application.Common.Services.FileDocumentManager;
using FluentValidation;
using MediatR;
using System.IO;

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
}

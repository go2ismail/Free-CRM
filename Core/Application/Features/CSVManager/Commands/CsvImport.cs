using MediatR;
using Application.Common.Services.CSVManager;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;

namespace Application.Features.CSVManager.Commands
{
    public record ImportCsvResult
    {
        public string Message { get; init; }
    }
    
    public class ImportCsvRequest : IRequest<ImportCsvResult>
    {
        public string FilePath { get; set; }
        public string EntityName { get; set; }
        public string Separator { get; set; } = ","; 
    }

    public class ImportCsvHandler : IRequestHandler<ImportCsvRequest, ImportCsvResult>
    {
        private readonly ICsvImportService _csvImportService;

        public ImportCsvHandler(ICsvImportService csvImportService)
        {
            _csvImportService = csvImportService;
        }

        public async Task<ImportCsvResult> Handle(ImportCsvRequest request, CancellationToken cancellationToken)
        {
            try
            {
                await _csvImportService.ImportCsvAsync<object>(request.FilePath, request.EntityName,  request.Separator);

                return new ImportCsvResult
                {
                    Message = "CSV import completed successfully."
                };
            }
            catch (Exception ex)
            {
                return new ImportCsvResult
                {   
                    Message = $"Error during CSV import: {ex.Message}"
                };
            }
        }
    }
}
using MediatR;
using Application.Common.Services.CSVManager;
using System.Threading;
using System.Threading.Tasks;

namespace Application.Features.CSVManager.Commands
{
    public record ExportCsvResult
    {
        public string Message { get; init; }
    }

    public class ExportCsvRequest : IRequest<ExportCsvResult>
    {
        public string FilePath { get; set; }
        public string EntityName { get; set; }
        public string Separator { get; set; } = ",";
    }

    public class ExportCsvHandler : IRequestHandler<ExportCsvRequest, ExportCsvResult>
    {
        private readonly ICsvExportService _csvExportService;

        public ExportCsvHandler(ICsvExportService csvExportService)
        {
            _csvExportService = csvExportService;
        }

        public async Task<ExportCsvResult> Handle(ExportCsvRequest request, CancellationToken cancellationToken)
        {
            try
            {
                await _csvExportService.ExportCsvAsync(request.EntityName, request.FilePath, request.Separator);
                return new ExportCsvResult
                {
                    Message = "CSV export completed successfully."
                };
            }
            catch (Exception ex)
            {
                return new ExportCsvResult
                {
                    Message = $"Error during CSV export: {ex.Message}"
                };
            }
        }
    }
}
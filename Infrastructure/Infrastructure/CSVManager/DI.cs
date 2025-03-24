using Application.Common.Services.CSVManager;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace Infrastructure.CSVManager
{
    public static class DI
    {
        public static IServiceCollection RegisterCSVManager(this IServiceCollection services, IConfiguration configuration)
        {
            services.Configure<CSVSettings>(configuration.GetSection("CSVSettings"));
            services.AddTransient<ICsvImportService, CsvImportService>();
            services.AddTransient<ICsvExportService, CsvExportService>();
            services.AddTransient<IEntityMetadataService, EntityMetadataService>();

            return services;
        }
    }
}
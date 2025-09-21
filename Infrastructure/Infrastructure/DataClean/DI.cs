using Application.Common.Services.CleanerData;
using Microsoft.Extensions.DependencyInjection;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Infrastructure.DataClean
{
    internal static class DI
    {

        public static IServiceCollection RegisterDatabaseCleanerService(this IServiceCollection services)
        {
            services.AddScoped<IDatabaseCleanerService, DatabaseCleanerService>();
            return services;
        }
        
    }
}

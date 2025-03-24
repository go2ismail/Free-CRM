using System.Linq;
using System.Threading.Tasks;
using Application.Common.Services.SeedManager;
using Infrastructure.DataAccessManager.EFCore.Contexts;
using Infrastructure.SeedManager.Demos;
using Infrastructure.SeedManager.Systems;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;

namespace Infrastructure.SeedManager
{
    public class DataSeederService : IDataSeederService
    {
        private readonly IServiceScopeFactory _serviceScopeFactory;
        private readonly ILogger<DataSeederService> _logger;

        public DataSeederService(IServiceScopeFactory serviceScopeFactory, ILogger<DataSeederService> logger)
        {
            _serviceScopeFactory = serviceScopeFactory;
            _logger = logger;
        }

        public async Task SeedSystemDataAsync()
        {
            using var scope = _serviceScopeFactory.CreateScope();
            var serviceProvider = scope.ServiceProvider;
            var context = serviceProvider.GetRequiredService<DataContext>();

            if (!context.Roles.Any())
            {
                _logger.LogInformation("Génération des données système...");

                await serviceProvider.GetRequiredService<RoleSeeder>().GenerateDataAsync();
                await serviceProvider.GetRequiredService<UserAdminSeeder>().GenerateDataAsync();
                await serviceProvider.GetRequiredService<CompanySeeder>().GenerateDataAsync();

                _logger.LogInformation("Données système générées avec succès.");
            }
        }

        public async Task SeedDemoDataAsync()
        {
            using var scope = _serviceScopeFactory.CreateScope();
            var serviceProvider = scope.ServiceProvider;
            var context = serviceProvider.GetRequiredService<DataContext>();

            if (!context.Tax.Any())
            {
                _logger.LogInformation("Génération des données de démonstration...");

                await serviceProvider.GetRequiredService<TaxSeeder>().GenerateRandomDataAsync(1);
                await serviceProvider.GetRequiredService<UserSeeder>().GenerateRandomDataAsync(1);
                await serviceProvider.GetRequiredService<CustomerCategorySeeder>().GenerateRandomDataAsync(1);
                await serviceProvider.GetRequiredService<CustomerGroupSeeder>().GenerateRandomDataAsync(1);
                await serviceProvider.GetRequiredService<CustomerSeeder>().GenerateRandomDataAsync(1);
                await serviceProvider.GetRequiredService<CustomerContactSeeder>().GenerateRandomDataAsync(1);
                await serviceProvider.GetRequiredService<VendorCategorySeeder>().GenerateRandomDataAsync(1);
                await serviceProvider.GetRequiredService<VendorGroupSeeder>().GenerateRandomDataAsync(1);
                await serviceProvider.GetRequiredService<VendorSeeder>().GenerateRandomDataAsync(1);
                await serviceProvider.GetRequiredService<VendorContactSeeder>().GenerateRandomDataAsync(1);
                await serviceProvider.GetRequiredService<UnitMeasureSeeder>().GenerateRandomDataAsync(1);
                await serviceProvider.GetRequiredService<ProductGroupSeeder>().GenerateRandomDataAsync(1);
                await serviceProvider.GetRequiredService<ProductSeeder>().GenerateRandomDataAsync(1);
                await serviceProvider.GetRequiredService<SalesOrderSeeder>().GenerateRandomDataAsync(1);
                await serviceProvider.GetRequiredService<PurchaseOrderSeeder>().GenerateRandomDataAsync(1);
                await serviceProvider.GetRequiredService<SalesTeamSeeder>().GenerateRandomDataAsync(1);
                await serviceProvider.GetRequiredService<SalesRepresentativeSeeder>().GenerateRandomDataAsync(1);
                await serviceProvider.GetRequiredService<CampaignSeeder>().GenerateRandomDataAsync(1);
                await serviceProvider.GetRequiredService<BudgetSeeder>().GenerateRandomDataAsync(1);
                await serviceProvider.GetRequiredService<ExpenseSeeder>().GenerateRandomDataAsync(1);
                await serviceProvider.GetRequiredService<LeadSeeder>().GenerateRandomDataAsync(1);
                await serviceProvider.GetRequiredService<LeadContactSeeder>().GenerateRandomDataAsync(1);
                await serviceProvider.GetRequiredService<LeadActivitySeeder>().GenerateRandomDataAsync(1);

                _logger.LogInformation("Données de démonstration générées avec succès.");
            }
        }
    }
}

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

                await serviceProvider.GetRequiredService<TaxSeeder>().GenerateDataAsync();
                await serviceProvider.GetRequiredService<UserSeeder>().GenerateDataAsync();
                await serviceProvider.GetRequiredService<CustomerCategorySeeder>().GenerateDataAsync();
                await serviceProvider.GetRequiredService<CustomerGroupSeeder>().GenerateDataAsync();
                await serviceProvider.GetRequiredService<CustomerSeeder>().GenerateDataAsync();
                await serviceProvider.GetRequiredService<CustomerContactSeeder>().GenerateDataAsync();
                await serviceProvider.GetRequiredService<VendorCategorySeeder>().GenerateDataAsync();
                await serviceProvider.GetRequiredService<VendorGroupSeeder>().GenerateDataAsync();
                await serviceProvider.GetRequiredService<VendorSeeder>().GenerateDataAsync();
                await serviceProvider.GetRequiredService<VendorContactSeeder>().GenerateDataAsync();
                await serviceProvider.GetRequiredService<UnitMeasureSeeder>().GenerateDataAsync();
                await serviceProvider.GetRequiredService<ProductGroupSeeder>().GenerateDataAsync();
                await serviceProvider.GetRequiredService<ProductSeeder>().GenerateDataAsync();
                await serviceProvider.GetRequiredService<SalesOrderSeeder>().GenerateDataAsync();
                await serviceProvider.GetRequiredService<PurchaseOrderSeeder>().GenerateDataAsync();
                await serviceProvider.GetRequiredService<SalesTeamSeeder>().GenerateDataAsync();
                await serviceProvider.GetRequiredService<SalesRepresentativeSeeder>().GenerateDataAsync();
                await serviceProvider.GetRequiredService<CampaignSeeder>().GenerateDataAsync();
                await serviceProvider.GetRequiredService<BudgetSeeder>().GenerateDataAsync();
                await serviceProvider.GetRequiredService<ExpenseSeeder>().GenerateDataAsync();
                await serviceProvider.GetRequiredService<LeadSeeder>().GenerateDataAsync();
                await serviceProvider.GetRequiredService<LeadContactSeeder>().GenerateDataAsync();
                await serviceProvider.GetRequiredService<LeadActivitySeeder>().GenerateDataAsync();

                _logger.LogInformation("Données de démonstration générées avec succès.");
            }
        }
    }
}

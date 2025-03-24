using Application.Common.Services.SeedManager;
using Infrastructure.DataAccessManager.EFCore.Contexts;
using Infrastructure.SeedManager.Demos;
using Infrastructure.SeedManager.Systems;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;

namespace Infrastructure.SeedManager;

public static class DI
{
    //>>> System Seed

    public static IServiceCollection RegisterSystemSeedManager(this IServiceCollection services, IConfiguration configuration)
    {
        services.AddScoped<RoleSeeder>();
        services.AddScoped<UserAdminSeeder>();
        services.AddScoped<CompanySeeder>();
        services.AddScoped<IDataSeederService, DataSeederService>();
        return services;
    }


    public static IHost SeedSystemData(this IHost host)
    {
        using var scope = host.Services.CreateScope();
        var serviceProvider = scope.ServiceProvider;

        var context = serviceProvider.GetRequiredService<DataContext>();
        if (!context.Roles.Any()) //if empty, thats mean never been seeded before
        {
            var roleSeeder = serviceProvider.GetRequiredService<RoleSeeder>();
            roleSeeder.GenerateDataAsync().Wait();

            var userAdminSeeder = serviceProvider.GetRequiredService<UserAdminSeeder>();
            userAdminSeeder.GenerateDataAsync().Wait();

            var companySeeder = serviceProvider.GetRequiredService<CompanySeeder>();
            companySeeder.GenerateDataAsync().Wait();

        }

        return host;
    }



    //>>> Demo Seed

    public static IServiceCollection RegisterDemoSeedManager(this IServiceCollection services, IConfiguration configuration)
    {
        services.AddScoped<TaxSeeder>();
        services.AddScoped<UserSeeder>();
        services.AddScoped<CustomerCategorySeeder>();
        services.AddScoped<CustomerGroupSeeder>();
        services.AddScoped<CustomerSeeder>();
        services.AddScoped<CustomerContactSeeder>();
        services.AddScoped<VendorCategorySeeder>();
        services.AddScoped<VendorGroupSeeder>();
        services.AddScoped<VendorSeeder>();
        services.AddScoped<VendorContactSeeder>();
        services.AddScoped<UnitMeasureSeeder>();
        services.AddScoped<ProductGroupSeeder>();
        services.AddScoped<ProductSeeder>();
        services.AddScoped<SalesOrderSeeder>();
        services.AddScoped<PurchaseOrderSeeder>();


        services.AddScoped<SalesTeamSeeder>();
        services.AddScoped<SalesRepresentativeSeeder>();
        services.AddScoped<CampaignSeeder>();
        services.AddScoped<BudgetSeeder>();
        services.AddScoped<ExpenseSeeder>();
        services.AddScoped<LeadSeeder>();
        services.AddScoped<LeadContactSeeder>();
        services.AddScoped<LeadActivitySeeder>();
        services.AddScoped<IDataSeederService, DataSeederService>();
        return services;
    }
    public static IHost SeedDemoData(this IHost host)
    {
        using var scope = host.Services.CreateScope();
        var serviceProvider = scope.ServiceProvider;

        var context = serviceProvider.GetRequiredService<DataContext>();
        if (!context.Tax.Any()) //if empty, thats mean never been seeded before
        {
            var taxSeeder = serviceProvider.GetRequiredService<TaxSeeder>();
            taxSeeder.GenerateDataAsync().Wait();

            var userSeeder = serviceProvider.GetRequiredService<UserSeeder>();
            userSeeder.GenerateDataAsync().Wait();

            var customerCategorySeeder = serviceProvider.GetRequiredService<CustomerCategorySeeder>();
            customerCategorySeeder.GenerateDataAsync().Wait();

            var customerGroupSeeder = serviceProvider.GetRequiredService<CustomerGroupSeeder>();
            customerGroupSeeder.GenerateDataAsync().Wait();

            var customerSeeder = serviceProvider.GetRequiredService<CustomerSeeder>();
            customerSeeder.GenerateDataAsync().Wait();

            var customerContactSeeder = serviceProvider.GetRequiredService<CustomerContactSeeder>();
            customerContactSeeder.GenerateDataAsync().Wait();

            var vendorCategorySeeder = serviceProvider.GetRequiredService<VendorCategorySeeder>();
            vendorCategorySeeder.GenerateDataAsync().Wait();

            var vendorGroupSeeder = serviceProvider.GetRequiredService<VendorGroupSeeder>();
            vendorGroupSeeder.GenerateDataAsync().Wait();

            var vendorSeeder = serviceProvider.GetRequiredService<VendorSeeder>();
            vendorSeeder.GenerateDataAsync().Wait();

            var vendorContactSeeder = serviceProvider.GetRequiredService<VendorContactSeeder>();
            vendorContactSeeder.GenerateDataAsync().Wait();

            var unitMeasureSeeder = serviceProvider.GetRequiredService<UnitMeasureSeeder>();
            unitMeasureSeeder.GenerateDataAsync().Wait();

            var productGroupSeeder = serviceProvider.GetRequiredService<ProductGroupSeeder>();
            productGroupSeeder.GenerateDataAsync().Wait();

            var productSeeder = serviceProvider.GetRequiredService<ProductSeeder>();
            productSeeder.GenerateDataAsync().Wait();

            var salesOrderSeeder = serviceProvider.GetRequiredService<SalesOrderSeeder>();
            salesOrderSeeder.GenerateDataAsync().Wait();

            var purchaseOrderSeeder = serviceProvider.GetRequiredService<PurchaseOrderSeeder>();
            purchaseOrderSeeder.GenerateDataAsync().Wait();



            var salesTeamSeeder = serviceProvider.GetRequiredService<SalesTeamSeeder>();
            salesTeamSeeder.GenerateDataAsync().Wait();

            var salesRepresentativeSeeder = serviceProvider.GetRequiredService<SalesRepresentativeSeeder>();
            salesRepresentativeSeeder.GenerateDataAsync().Wait();

            var campaignSeeder = serviceProvider.GetRequiredService<CampaignSeeder>();
            campaignSeeder.GenerateDataAsync().Wait();
            
            var budgetSeeder = serviceProvider.GetRequiredService<BudgetSeeder>();
            budgetSeeder.GenerateDataAsync().Wait();
            
            var expenseSeeder = serviceProvider.GetRequiredService<ExpenseSeeder>();
            expenseSeeder.GenerateDataAsync().Wait();
            
            var leadSeeder = serviceProvider.GetRequiredService<LeadSeeder>();
            leadSeeder.GenerateDataAsync().Wait();
            
            var leadContactSeeder = serviceProvider.GetRequiredService<LeadContactSeeder>();
            leadContactSeeder.GenerateDataAsync().Wait();
            
            var leadActivitySeeder = serviceProvider.GetRequiredService<LeadActivitySeeder>();
            leadActivitySeeder.GenerateDataAsync().Wait();

        }
        return host;
    }
}


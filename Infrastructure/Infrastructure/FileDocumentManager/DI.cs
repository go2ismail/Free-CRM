using Application.Common.Repositories;
using Application.Common.Services.FileDocumentManager;
using Domain.Entities;
using Infrastructure.DataAccessManager.EFCore.Repositories;
using Infrastructure.SeedManager.Demos;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace Infrastructure.FileDocumentManager;

public static class DI
{
    public static IServiceCollection RegisterFileDocumentManager(this IServiceCollection services, IConfiguration configuration)
    {
        services.Configure<FileDocumentSettings>(configuration.GetSection("FileDocumentManager"));
        services.AddTransient<IFileDocumentService, FileDocumentService>();
        services.AddTransient<ICSVService, CSVService>();
        
        services.AddScoped(typeof(ICommandRepository<>), typeof(CommandRepository<>));
        services.AddScoped<IUnitOfWork, UnitOfWork>();
        
        services.AddScoped<SalesTeamSeeder>();
        services.AddScoped<SalesRepresentativeSeeder>();

        return services;
    }
}

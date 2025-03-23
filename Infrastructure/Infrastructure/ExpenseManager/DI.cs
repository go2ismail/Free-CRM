using Application.Common.Services.ExpenseManager;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace Infrastructure.ExpenseManager;

public static class DI
{
    public static IServiceCollection RegisterExpenseManager(this IServiceCollection services, IConfiguration configuration)
    {
        services.AddTransient<IExpenseService, ExpenseService>();

        return services;
    }
}

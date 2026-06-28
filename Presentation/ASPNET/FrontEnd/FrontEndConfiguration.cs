using Microsoft.AspNetCore.Mvc.RazorPages;

namespace ASPNET.FrontEnd;

public static class FrontEndConfiguration
{
    public static IServiceCollection AddFrontEndServices(this IServiceCollection services)
    {
        services.AddRazorPages(options =>
        {
            options.RootDirectory = "/FrontEnd/Pages";
            options.Conventions.ConfigureFilter(new PageAuthorizationFilter());
        });
        return services;
    }

    public static IEndpointRouteBuilder MapFrontEndRoutes(this IEndpointRouteBuilder endpoints)
    {
        endpoints.MapRazorPages()
            .WithStaticAssets();
        return endpoints;
    }
}

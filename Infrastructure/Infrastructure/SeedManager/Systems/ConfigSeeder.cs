using Domain.Entities;
using Infrastructure.DataAccessManager.EFCore.Contexts;
using Microsoft.Extensions.Logging;

namespace Infrastructure.SeedManager.Systems
{
    public class ConfigSeeder
    {
        private readonly DataContext _context;
        private readonly ILogger<ConfigSeeder> _logger;

        public ConfigSeeder(DataContext context, ILogger<ConfigSeeder> logger)
        {
            _context = context;
            _logger = logger;
        }

        public async Task GenerateDataAsync()
        {
            if (!_context.Config.Any())
            {
                _logger.LogInformation("Seeding Config data...");

                var configs = new List<Config>
                {
                    new Config { Name = "AlertBudget", Value = "10" },
                };

                _context.Config.AddRange(configs);
                await _context.SaveChangesAsync();

                _logger.LogInformation("Seeding Config data completed.");
            }
        }
    }
}
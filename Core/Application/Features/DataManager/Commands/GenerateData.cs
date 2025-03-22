using MediatR;
using Microsoft.Extensions.Logging;
using System;
using System.Threading;
using System.Threading.Tasks;
using Application;
using Application.Common.Services.SeedManager;

namespace Application.Features.DataManager.Commands
{
    // === REQUÊTES (COMMANDS) ===
    public class GenerateSystemDataRequest : IRequest<GenerateSystemDataResult> { }
    public class GenerateDemoDataRequest : IRequest<GenerateDemoDataResult> { }
    public class GenerateAllDataRequest : IRequest<GenerateAllDataResult> { }

    // === RÉSULTATS (RESULTS) ===
    public class GenerateSystemDataResult
    {
        public bool Success { get; set; }
        public string Message { get; set; }
    }

    public class GenerateDemoDataResult
    {
        public bool Success { get; set; }
        public string Message { get; set; }
    }

    public class GenerateAllDataResult
    {
        public bool Success { get; set; }
        public string Message { get; set; }
    }

    // === HANDLER POUR SYSTEM DATA ===
    public class GenerateSystemDataHandler : IRequestHandler<GenerateSystemDataRequest, GenerateSystemDataResult>
    {
        private readonly IDataSeederService _dataSeederService;
        private readonly ILogger<GenerateSystemDataHandler> _logger;

        public GenerateSystemDataHandler(IDataSeederService dataSeederService, ILogger<GenerateSystemDataHandler> logger)
        {
            _dataSeederService = dataSeederService;
            _logger = logger;
        }

        public async Task<GenerateSystemDataResult> Handle(GenerateSystemDataRequest request, CancellationToken cancellationToken)
        {
            _logger.LogInformation("Début de la génération des données système...");

            try
            {
                await _dataSeederService.SeedSystemDataAsync();
                _logger.LogInformation("Données système générées avec succès.");

                return new GenerateSystemDataResult { Success = true, Message = "Données système générées avec succès." };
            }
            catch (Exception ex)
            {
                _logger.LogError($"Erreur lors de la génération des données système : {ex.Message}");
                return new GenerateSystemDataResult { Success = false, Message = "Échec de la génération des données système." };
            }
        }
    }

    // === HANDLER POUR DEMO DATA ===
    public class GenerateDemoDataHandler : IRequestHandler<GenerateDemoDataRequest, GenerateDemoDataResult>
    {
        private readonly IDataSeederService _dataSeederService;
        private readonly ILogger<GenerateDemoDataHandler> _logger;

        public GenerateDemoDataHandler(IDataSeederService dataSeederService, ILogger<GenerateDemoDataHandler> logger)
        {
            _dataSeederService = dataSeederService;
            _logger = logger;
        }

        public async Task<GenerateDemoDataResult> Handle(GenerateDemoDataRequest request, CancellationToken cancellationToken)
        {
            _logger.LogInformation("Début de la génération des données de démonstration...");

            try
            {
                await _dataSeederService.SeedDemoDataAsync();
                _logger.LogInformation("Données de démonstration générées avec succès.");

                return new GenerateDemoDataResult { Success = true, Message = "Données de démonstration générées avec succès." };
            }
            catch (Exception ex)
            {
                _logger.LogError($"Erreur lors de la génération des données de démonstration : {ex.Message}");
                return new GenerateDemoDataResult { Success = false, Message = "Échec de la génération des données de démonstration." };
            }
        }
    }

    // === HANDLER POUR TOUTES LES DONNÉES ===
    public class GenerateAllDataHandler : IRequestHandler<GenerateAllDataRequest, GenerateAllDataResult>
    {
        private readonly IDataSeederService _dataSeederService;
        private readonly ILogger<GenerateAllDataHandler> _logger;

        public GenerateAllDataHandler(IDataSeederService dataSeederService, ILogger<GenerateAllDataHandler> logger)
        {
            _dataSeederService = dataSeederService;
            _logger = logger;
        }

        public async Task<GenerateAllDataResult> Handle(GenerateAllDataRequest request, CancellationToken cancellationToken)
        {
            _logger.LogInformation("Début de la génération de toutes les données...");

            try
            {
                await _dataSeederService.SeedSystemDataAsync();
                await _dataSeederService.SeedDemoDataAsync();
                _logger.LogInformation("Toutes les données générées avec succès.");

                return new GenerateAllDataResult { Success = true, Message = "Toutes les données générées avec succès." };
            }
            catch (Exception ex)
            {
                _logger.LogError($"Erreur lors de la génération des données : {ex.Message}");
                return new GenerateAllDataResult { Success = false, Message = "Échec de la génération des données." };
            }
        }
    }
}

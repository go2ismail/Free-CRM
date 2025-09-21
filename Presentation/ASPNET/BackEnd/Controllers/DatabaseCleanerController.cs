using Application.Common.Services.CleanerData;
using Infrastructure.SeedManager;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ASPNET.BackEnd.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class DatabaseCleanerController : ControllerBase
    {
        private readonly IDatabaseCleanerService _cleanerService;
        private readonly ILogger<DatabaseCleanerController> _logger;

        public DatabaseCleanerController( IDatabaseCleanerService cleanerService, ILogger<DatabaseCleanerController> logger )
        {
            _cleanerService = cleanerService;
            _logger = logger;
        }

        /// <summary>
        /// Nettoie toutes les données de la base de données
        /// </summary>
        /// <returns>Rapport de nettoyage</returns>
        [HttpDelete("clean-all")]
        [ProducesResponseType(typeof(CleanupResponseDto), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(CleanupResponseDto), StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> CleanAllData()
        {
            try
            {
                _logger.LogInformation("Demande de nettoyage complet de la base de données");

                var report = await _cleanerService.CleanAllDataAsync();

                var response = new CleanupResponseDto
                {
                    Success = report.Success,
                    Message = report.Message,
                    ErrorMessage = report.ErrorMessage,
                    TotalEntitiesRemoved = report.TotalEntitiesRemoved
                };

                if (report.Success)
                    return Ok(response);
                else
                    return StatusCode(StatusCodes.Status500InternalServerError, response);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Erreur non gérée lors du nettoyage de la base de données");

                return StatusCode(StatusCodes.Status500InternalServerError, new CleanupResponseDto
                {
                    Success = false,
                    ErrorMessage = "Une erreur est survenue lors du nettoyage de la base de données",
                    TotalEntitiesRemoved = 0
                });
            }
        }

        /// <summary>
        /// Nettoie puis régénère des données de démonstration
        /// </summary>
        /// <returns>Rapport de l'opération</returns>
        [HttpPost("reset-demo-data")]
        [ProducesResponseType(typeof(CleanupResponseDto), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(CleanupResponseDto), StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> ResetDemoData(
            [FromServices] IHost host)
        {
            try
            {
                _logger.LogInformation("Demande de Generer des données de démonstration");

                // Nettoyer d'abord toutes les données
                //var cleanReport = await _cleanerService.CleanAllDataAsync();

                //if (!cleanReport.Success)
                //{
                //    return StatusCode(StatusCodes.Status500InternalServerError, new CleanupResponseDto
                //    {
                //        Success = false,
                //        ErrorMessage = $"Erreur lors du nettoyage: {cleanReport.ErrorMessage}",
                //        TotalEntitiesRemoved = cleanReport.TotalEntitiesRemoved
                //    });
                //}

                // Maintenant, régénérer les données de démo
                try
                {
                    // Utiliser la méthode d'extension existante pour seeder les données
                    //host.SeedSystemData();
                    var generateReport=host.SeedDemoData();

                    return Ok(new CleanupResponseDto
                    {
                        Success = true,
                        Message = $"Données de démonstration generer avec succès.",
                    });
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "Erreur lors de la génération des données de démo");

                    return StatusCode(StatusCodes.Status500InternalServerError, new CleanupResponseDto
                    {
                        Success = false,
                        ErrorMessage = $"Données supprimées mais erreur lors de la régénération: {ex.Message}",
                    });
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Erreur non gérée lors de la réinitialisation des données de démo");

                return StatusCode(StatusCodes.Status500InternalServerError, new CleanupResponseDto
                {
                    Success = false,
                    ErrorMessage = "Une erreur est survenue lors de la réinitialisation des données de démonstration",
                    TotalEntitiesRemoved = 0
                });
            }
        }
    }
}

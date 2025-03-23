using Application.Features.ParamSettingsManager.Commands;
using ASPNET.BackEnd.Common.Base;
using MediatR;
using Microsoft.AspNetCore.Mvc;
using System.Threading;
using System.Threading.Tasks;
using Application.Features.ExpenseManager.Commands;
using ASPNET.BackEnd.Common.Models;

namespace ASPNET.BackEnd.Controllers
{
    [Route("api/[controller]")]
    public class ParamSettingsController : BaseApiController
    {
        public ParamSettingsController(ISender sender) : base(sender) { }

        [HttpPost("Upsert")]
        public async Task<IActionResult> UpsertParamSettings([FromBody] UpsertParamSettingsRequest request, CancellationToken cancellationToken)
        {
            var result = await _sender.Send(request, cancellationToken);

            if (result.Data != null)
            {
                Console.WriteLine("Résultat trouvé :");
                Console.WriteLine($"ParamName: {result.Data.ParamName}, ParamValue: {result.Data.ParamValue}");
            }
            else
            {
                Console.WriteLine("Aucun résultat trouvé : Échec de l'opération Upsert.");
            }

            if (result.Data == null)
            {
                return BadRequest(new { Message = "Failed to upsert param settings." });
            }

            return Ok(new ApiSuccessResult<UpsertParamSettingsResult>
            {
                Code = StatusCodes.Status200OK,
                Message = $"Success upserting the Param Settings",
                Content = result
            });
            
        }

    }
}
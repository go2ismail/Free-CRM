using Application.Features.DataManager.Commands;
using ASPNET.BackEnd.Common.Base;
using ASPNET.BackEnd.Common.Models;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Threading;
using System.Threading.Tasks;

namespace ASPNET.BackEnd.Controllers;

[Route("api/[controller]")]
public class DataGenerationController : BaseApiController
{
    public DataGenerationController(ISender sender) : base(sender)
    {
    }

    /// <summary>
    /// Génère les données système nécessaires au bon fonctionnement de l'application.
    /// </summary>
    [AllowAnonymous]
    [HttpPost("GenerateSystemData")]
    public async Task<ActionResult<ApiSuccessResult<GenerateSystemDataResult>>> GenerateSystemDataAsync(
        GenerateSystemDataRequest request, 
        CancellationToken cancellationToken)
    {
        var response = await _sender.Send(request, cancellationToken);

        return Ok(new ApiSuccessResult<GenerateSystemDataResult>
        {
            Code = StatusCodes.Status200OK,
            Message = $"Success executing {nameof(GenerateSystemDataAsync)}",
            Content = response
        });
    }

    /// <summary>
    /// Génère les données de démonstration (Fake Data)
    /// </summary>
    [AllowAnonymous]
    [HttpPost("GenerateDemoData")]
    public async Task<ActionResult<ApiSuccessResult<GenerateDemoDataResult>>> GenerateDemoDataAsync(
        GenerateDemoDataRequest request, 
        CancellationToken cancellationToken)
    {
        var response = await _sender.Send(request, cancellationToken);

        return Ok(new ApiSuccessResult<GenerateDemoDataResult>
        {
            Code = StatusCodes.Status200OK,
            Message = $"Success executing {nameof(GenerateDemoDataAsync)}",
            Content = response
        });
    }

    /// <summary>
    /// Génère à la fois les données système et les données de démonstration.
    /// </summary>
    [AllowAnonymous]
    [HttpPost("GenerateAllData")]
    public async Task<ActionResult<ApiSuccessResult<GenerateAllDataResult>>> GenerateAllDataAsync(
        GenerateAllDataRequest request, 
        CancellationToken cancellationToken)
    {
        var response = await _sender.Send(request, cancellationToken);

        return Ok(new ApiSuccessResult<GenerateAllDataResult>
        {
            Code = StatusCodes.Status200OK,
            Message = $"Success executing {nameof(GenerateAllDataAsync)}",
            Content = response
        });
    }
}

using Application.Features.RateManager.Commands;
using ASPNET.BackEnd.Common.Base;
using ASPNET.BackEnd.Common.Models;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ASPNET.BackEnd.Controllers;

[Route("api/[controller]")]
public class RateController : BaseApiController
{
    public RateController(ISender sender) : base(sender)
    {
    }

    [Authorize]
    [HttpPost("CreateRate")]
    public async Task<ActionResult<ApiSuccessResult<CreateRateResult>>> CreateRateAsync(CreateRateRequest request, CancellationToken cancellationToken)
    {
        var response = await _sender.Send(request, cancellationToken);

        return Ok(new ApiSuccessResult<CreateRateResult>
        {
            Code = StatusCodes.Status200OK,
            Message = $"Success executing {nameof(CreateRateAsync)}",
            Content = response
        });
    }
}



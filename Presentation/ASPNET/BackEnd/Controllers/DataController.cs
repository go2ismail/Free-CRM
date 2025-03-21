using Application.Features.DataManager.Commands;
using ASPNET.BackEnd.Common.Base;
using ASPNET.BackEnd.Common.Models;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ASPNET.BackEnd.Controllers;

[Route("api/[controller]")]
public class DataController : BaseApiController
{
    public DataController(ISender sender) : base(sender)
    {
    }

    [AllowAnonymous]
    [HttpPost("ResetData")]
    public async Task<ActionResult<ApiSuccessResult<ResetDataResult>>> ResetDataAsync(CancellationToken cancellationToken)
    {
        var response = await _sender.Send(new ResetDataRequest(), cancellationToken);

        return Ok(new ApiSuccessResult<ResetDataResult>
        {
            Code = StatusCodes.Status200OK,
            Message = "Reset successful",
            Content = response
        });
    }

}
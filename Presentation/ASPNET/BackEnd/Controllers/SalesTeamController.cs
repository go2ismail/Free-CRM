using Application.Features.SalesTeamManager.Commands;
using Application.Features.SalesTeamManager.Queries;
using ASPNET.BackEnd.Common.Base;
using ASPNET.BackEnd.Common.Models;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ASPNET.BackEnd.Controllers;

[Route("api/[controller]")]
public class SalesTeamController : BaseApiController
{
    public SalesTeamController(ISender sender) : base(sender)
    {
    }

    [Authorize]
    [HttpPost("CreateSalesTeam")]
    public async Task<ActionResult<ApiSuccessResult<CreateSalesTeamResult>>> CreateSalesTeamAsync(CreateSalesTeamRequest request, CancellationToken cancellationToken)
    {
        var response = await _sender.Send(request, cancellationToken);

        return Ok(new ApiSuccessResult<CreateSalesTeamResult>
        {
            Code = StatusCodes.Status200OK,
            Message = $"Success executing {nameof(CreateSalesTeamAsync)}",
            Content = response
        });
    }

    [Authorize]
    [HttpPost("UpdateSalesTeam")]
    public async Task<ActionResult<ApiSuccessResult<UpdateSalesTeamResult>>> UpdateSalesTeamAsync(UpdateSalesTeamRequest request, CancellationToken cancellationToken)
    {
        var response = await _sender.Send(request, cancellationToken);

        return Ok(new ApiSuccessResult<UpdateSalesTeamResult>
        {
            Code = StatusCodes.Status200OK,
            Message = $"Success executing {nameof(UpdateSalesTeamAsync)}",
            Content = response
        });
    }

    [Authorize]
    [HttpPost("DeleteSalesTeam")]
    public async Task<ActionResult<ApiSuccessResult<DeleteSalesTeamResult>>> DeleteSalesTeamAsync(DeleteSalesTeamRequest request, CancellationToken cancellationToken)
    {
        var response = await _sender.Send(request, cancellationToken);

        return Ok(new ApiSuccessResult<DeleteSalesTeamResult>
        {
            Code = StatusCodes.Status200OK,
            Message = $"Success executing {nameof(DeleteSalesTeamAsync)}",
            Content = response
        });
    }

    [Authorize]
    [HttpGet("GetSalesTeamList")]
    public async Task<ActionResult<ApiSuccessResult<GetSalesTeamListResult>>> GetSalesTeamListAsync(
        CancellationToken cancellationToken,
        [FromQuery] bool isDeleted = false
        )
    {
        var request = new GetSalesTeamListRequest { IsDeleted = isDeleted };
        var response = await _sender.Send(request, cancellationToken);

        return Ok(new ApiSuccessResult<GetSalesTeamListResult>
        {
            Code = StatusCodes.Status200OK,
            Message = $"Success executing {nameof(GetSalesTeamListAsync)}",
            Content = response
        });
    }


    [Authorize]
    [HttpGet("GetSalesTeamSingle")]
    public async Task<ActionResult<ApiSuccessResult<GetSalesTeamSingleResult>>> GetSalesTeamSingleAsync(
    CancellationToken cancellationToken,
    [FromQuery] string id
    )
    {
        var request = new GetSalesTeamSingleRequest { Id = id };
        var response = await _sender.Send(request, cancellationToken);

        return Ok(new ApiSuccessResult<GetSalesTeamSingleResult>
        {
            Code = StatusCodes.Status200OK,
            Message = $"Success executing {nameof(GetSalesTeamSingleAsync)}",
            Content = response
        });
    }


}





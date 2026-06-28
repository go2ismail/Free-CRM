using Application.Features.SalesRepresentativeManager.Commands;
using Application.Features.SalesRepresentativeManager.Queries;
using ASPNET.BackEnd.Common.Base;
using ASPNET.BackEnd.Common.Models;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ASPNET.BackEnd.Controllers;

[Route("api/[controller]")]
public class SalesRepresentativeController : BaseApiController
{
    public SalesRepresentativeController(ISender sender) : base(sender)
    {
    }

    [Authorize]
    [HttpPost("CreateSalesRepresentative")]
    public async Task<ActionResult<ApiSuccessResult<CreateSalesRepresentativeResult>>> CreateSalesRepresentativeAsync(CreateSalesRepresentativeRequest request, CancellationToken cancellationToken)
    {
        var response = await _sender.Send(request, cancellationToken);

        return Ok(new ApiSuccessResult<CreateSalesRepresentativeResult>
        {
            Code = StatusCodes.Status200OK,
            Message = $"Success executing {nameof(CreateSalesRepresentativeAsync)}",
            Content = response
        });
    }

    [Authorize]
    [HttpPost("UpdateSalesRepresentative")]
    public async Task<ActionResult<ApiSuccessResult<UpdateSalesRepresentativeResult>>> UpdateSalesRepresentativeAsync(UpdateSalesRepresentativeRequest request, CancellationToken cancellationToken)
    {
        var response = await _sender.Send(request, cancellationToken);

        return Ok(new ApiSuccessResult<UpdateSalesRepresentativeResult>
        {
            Code = StatusCodes.Status200OK,
            Message = $"Success executing {nameof(UpdateSalesRepresentativeAsync)}",
            Content = response
        });
    }

    [Authorize]
    [HttpPost("DeleteSalesRepresentative")]
    public async Task<ActionResult<ApiSuccessResult<DeleteSalesRepresentativeResult>>> DeleteSalesRepresentativeAsync(DeleteSalesRepresentativeRequest request, CancellationToken cancellationToken)
    {
        var response = await _sender.Send(request, cancellationToken);

        return Ok(new ApiSuccessResult<DeleteSalesRepresentativeResult>
        {
            Code = StatusCodes.Status200OK,
            Message = $"Success executing {nameof(DeleteSalesRepresentativeAsync)}",
            Content = response
        });
    }

    [Authorize]
    [HttpGet("GetSalesRepresentativeList")]
    public async Task<ActionResult<ApiSuccessResult<GetSalesRepresentativeListResult>>> GetSalesRepresentativeListAsync(
        CancellationToken cancellationToken,
        [FromQuery] bool isDeleted = false
        )
    {
        var request = new GetSalesRepresentativeListRequest { IsDeleted = isDeleted };
        var response = await _sender.Send(request, cancellationToken);

        return Ok(new ApiSuccessResult<GetSalesRepresentativeListResult>
        {
            Code = StatusCodes.Status200OK,
            Message = $"Success executing {nameof(GetSalesRepresentativeListAsync)}",
            Content = response
        });
    }


    [Authorize]
    [HttpGet("GetSalesRepresentativeSingle")]
    public async Task<ActionResult<ApiSuccessResult<GetSalesRepresentativeSingleResult>>> GetSalesRepresentativeSingleAsync(
    CancellationToken cancellationToken,
    [FromQuery] string id
    )
    {
        var request = new GetSalesRepresentativeSingleRequest { Id = id };
        var response = await _sender.Send(request, cancellationToken);

        return Ok(new ApiSuccessResult<GetSalesRepresentativeSingleResult>
        {
            Code = StatusCodes.Status200OK,
            Message = $"Success executing {nameof(GetSalesRepresentativeSingleAsync)}",
            Content = response
        });
    }


    [Authorize]
    [HttpGet("GetSalesRepresentativeBySalesTeamIdList")]
    public async Task<ActionResult<ApiSuccessResult<GetSalesRepresentativeBySalesTeamIdListResult>>> GetSalesRepresentativeBySalesTeamIdListAsync(
    CancellationToken cancellationToken,
    [FromQuery] string id
    )
    {
        var request = new GetSalesRepresentativeBySalesTeamIdListRequest { SalesTeamId = id };
        var response = await _sender.Send(request, cancellationToken);

        return Ok(new ApiSuccessResult<GetSalesRepresentativeBySalesTeamIdListResult>
        {
            Code = StatusCodes.Status200OK,
            Message = $"Success executing {nameof(GetSalesRepresentativeBySalesTeamIdListAsync)}",
            Content = response
        });
    }


}





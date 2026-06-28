using Application.Features.DeliveryOrderManager.Queries;
using Application.Features.LeadActivityManager.Commands;
using Application.Features.LeadActivityManager.Queries;
using ASPNET.BackEnd.Common.Base;
using ASPNET.BackEnd.Common.Models;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ASPNET.BackEnd.Controllers;

[Route("api/[controller]")]
public class LeadActivityController : BaseApiController
{
    public LeadActivityController(ISender sender) : base(sender)
    {
    }

    [Authorize]
    [HttpPost("CreateLeadActivity")]
    public async Task<ActionResult<ApiSuccessResult<CreateLeadActivityResult>>> CreateLeadActivityAsync(CreateLeadActivityRequest request, CancellationToken cancellationToken)
    {
        var response = await _sender.Send(request, cancellationToken);

        return Ok(new ApiSuccessResult<CreateLeadActivityResult>
        {
            Code = StatusCodes.Status200OK,
            Message = $"Success executing {nameof(CreateLeadActivityAsync)}",
            Content = response
        });
    }

    [Authorize]
    [HttpPost("UpdateLeadActivity")]
    public async Task<ActionResult<ApiSuccessResult<UpdateLeadActivityResult>>> UpdateLeadActivityAsync(UpdateLeadActivityRequest request, CancellationToken cancellationToken)
    {
        var response = await _sender.Send(request, cancellationToken);

        return Ok(new ApiSuccessResult<UpdateLeadActivityResult>
        {
            Code = StatusCodes.Status200OK,
            Message = $"Success executing {nameof(UpdateLeadActivityAsync)}",
            Content = response
        });
    }

    [Authorize]
    [HttpPost("DeleteLeadActivity")]
    public async Task<ActionResult<ApiSuccessResult<DeleteLeadActivityResult>>> DeleteLeadActivityAsync(DeleteLeadActivityRequest request, CancellationToken cancellationToken)
    {
        var response = await _sender.Send(request, cancellationToken);

        return Ok(new ApiSuccessResult<DeleteLeadActivityResult>
        {
            Code = StatusCodes.Status200OK,
            Message = $"Success executing {nameof(DeleteLeadActivityAsync)}",
            Content = response
        });
    }

    [Authorize]
    [HttpGet("GetLeadActivityList")]
    public async Task<ActionResult<ApiSuccessResult<GetLeadActivityListResult>>> GetLeadActivityListAsync(
        CancellationToken cancellationToken,
        [FromQuery] bool isDeleted = false
        )
    {
        var request = new GetLeadActivityListRequest { IsDeleted = isDeleted };
        var response = await _sender.Send(request, cancellationToken);

        return Ok(new ApiSuccessResult<GetLeadActivityListResult>
        {
            Code = StatusCodes.Status200OK,
            Message = $"Success executing {nameof(GetLeadActivityListAsync)}",
            Content = response
        });
    }


    [Authorize]
    [HttpGet("GetLeadActivitySingle")]
    public async Task<ActionResult<ApiSuccessResult<GetLeadActivitySingleResult>>> GetLeadActivitySingleAsync(
    CancellationToken cancellationToken,
    [FromQuery] string id
    )
    {
        var request = new GetLeadActivitySingleRequest { Id = id };
        var response = await _sender.Send(request, cancellationToken);

        return Ok(new ApiSuccessResult<GetLeadActivitySingleResult>
        {
            Code = StatusCodes.Status200OK,
            Message = $"Success executing {nameof(GetLeadActivitySingleAsync)}",
            Content = response
        });
    }


    [Authorize]
    [HttpGet("GetLeadActivityByLeadIdList")]
    public async Task<ActionResult<ApiSuccessResult<GetLeadActivityByLeadIdListResult>>> GetLeadActivityByLeadIdListAsync(
    CancellationToken cancellationToken,
    [FromQuery] string leadId
    )
    {
        var request = new GetLeadActivityByLeadIdListRequest { LeadId = leadId };
        var response = await _sender.Send(request, cancellationToken);

        return Ok(new ApiSuccessResult<GetLeadActivityByLeadIdListResult>
        {
            Code = StatusCodes.Status200OK,
            Message = $"Success executing {nameof(GetLeadActivityByLeadIdListAsync)}",
            Content = response
        });
    }


    [Authorize]
    [HttpGet("GetLeadActivityTypeList")]
    public async Task<ActionResult<ApiSuccessResult<GetLeadActivityTypeListResult>>> GetLeadActivityTypeListAsync(
        CancellationToken cancellationToken
        )
    {
        var request = new GetLeadActivityTypeListRequest { };
        var response = await _sender.Send(request, cancellationToken);

        return Ok(new ApiSuccessResult<GetLeadActivityTypeListResult>
        {
            Code = StatusCodes.Status200OK,
            Message = $"Success executing {nameof(GetLeadActivityTypeListAsync)}",
            Content = response
        });
    }


}





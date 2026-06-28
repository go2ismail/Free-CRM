using Application.Features.LeadContactManager.Commands;
using Application.Features.LeadContactManager.Queries;
using ASPNET.BackEnd.Common.Base;
using ASPNET.BackEnd.Common.Models;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ASPNET.BackEnd.Controllers;

[Route("api/[controller]")]
public class LeadContactController : BaseApiController
{
    public LeadContactController(ISender sender) : base(sender)
    {
    }

    [Authorize]
    [HttpPost("CreateLeadContact")]
    public async Task<ActionResult<ApiSuccessResult<CreateLeadContactResult>>> CreateLeadContactAsync(CreateLeadContactRequest request, CancellationToken cancellationToken)
    {
        var response = await _sender.Send(request, cancellationToken);

        return Ok(new ApiSuccessResult<CreateLeadContactResult>
        {
            Code = StatusCodes.Status200OK,
            Message = $"Success executing {nameof(CreateLeadContactAsync)}",
            Content = response
        });
    }

    [Authorize]
    [HttpPost("UpdateLeadContact")]
    public async Task<ActionResult<ApiSuccessResult<UpdateLeadContactResult>>> UpdateLeadContactAsync(UpdateLeadContactRequest request, CancellationToken cancellationToken)
    {
        var response = await _sender.Send(request, cancellationToken);

        return Ok(new ApiSuccessResult<UpdateLeadContactResult>
        {
            Code = StatusCodes.Status200OK,
            Message = $"Success executing {nameof(UpdateLeadContactAsync)}",
            Content = response
        });
    }

    [Authorize]
    [HttpPost("DeleteLeadContact")]
    public async Task<ActionResult<ApiSuccessResult<DeleteLeadContactResult>>> DeleteLeadContactAsync(DeleteLeadContactRequest request, CancellationToken cancellationToken)
    {
        var response = await _sender.Send(request, cancellationToken);

        return Ok(new ApiSuccessResult<DeleteLeadContactResult>
        {
            Code = StatusCodes.Status200OK,
            Message = $"Success executing {nameof(DeleteLeadContactAsync)}",
            Content = response
        });
    }

    [Authorize]
    [HttpGet("GetLeadContactList")]
    public async Task<ActionResult<ApiSuccessResult<GetLeadContactListResult>>> GetLeadContactListAsync(
        CancellationToken cancellationToken,
        [FromQuery] bool isDeleted = false
        )
    {
        var request = new GetLeadContactListRequest { IsDeleted = isDeleted };
        var response = await _sender.Send(request, cancellationToken);

        return Ok(new ApiSuccessResult<GetLeadContactListResult>
        {
            Code = StatusCodes.Status200OK,
            Message = $"Success executing {nameof(GetLeadContactListAsync)}",
            Content = response
        });
    }


    [Authorize]
    [HttpGet("GetLeadContactSingle")]
    public async Task<ActionResult<ApiSuccessResult<GetLeadContactSingleResult>>> GetLeadContactSingleAsync(
    CancellationToken cancellationToken,
    [FromQuery] string id
    )
    {
        var request = new GetLeadContactSingleRequest { Id = id };
        var response = await _sender.Send(request, cancellationToken);

        return Ok(new ApiSuccessResult<GetLeadContactSingleResult>
        {
            Code = StatusCodes.Status200OK,
            Message = $"Success executing {nameof(GetLeadContactSingleAsync)}",
            Content = response
        });
    }


    [Authorize]
    [HttpGet("GetLeadContactByLeadIdList")]
    public async Task<ActionResult<ApiSuccessResult<GetLeadContactByLeadIdListResult>>> GetLeadContactByLeadIdListAsync(
    CancellationToken cancellationToken,
    [FromQuery] string leadId
    )
    {
        var request = new GetLeadContactByLeadIdListRequest { LeadId = leadId };
        var response = await _sender.Send(request, cancellationToken);

        return Ok(new ApiSuccessResult<GetLeadContactByLeadIdListResult>
        {
            Code = StatusCodes.Status200OK,
            Message = $"Success executing {nameof(GetLeadContactByLeadIdListAsync)}",
            Content = response
        });
    }


}





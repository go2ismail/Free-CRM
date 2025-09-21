using Application.Features.CampaignManager.Commands;
using Application.Features.CampaignManager.Queries;
using ASPNET.BackEnd.Common.Base;
using ASPNET.BackEnd.Common.Models;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ASPNET.BackEnd.Controllers;

[Route("api/[controller]")]
public class CampaignController : BaseApiController
{
    public CampaignController(ISender sender) : base(sender)
    {
    }

    [Authorize]
    [HttpPost("CreateCampaign")]
    public async Task<ActionResult<ApiSuccessResult<CreateCampaignResult>>> CreateCampaignAsync(CreateCampaignRequest request, CancellationToken cancellationToken)
    {
        var response = await _sender.Send(request, cancellationToken);

        return Ok(new ApiSuccessResult<CreateCampaignResult>
        {
            Code = StatusCodes.Status200OK,
            Message = $"Success executing {nameof(CreateCampaignAsync)}",
            Content = response
        });
    }

    [Authorize]
    [HttpPost("UpdateCampaign")]
    public async Task<ActionResult<ApiSuccessResult<UpdateCampaignResult>>> UpdateCampaignAsync(UpdateCampaignRequest request, CancellationToken cancellationToken)
    {
        var response = await _sender.Send(request, cancellationToken);

        return Ok(new ApiSuccessResult<UpdateCampaignResult>
        {
            Code = StatusCodes.Status200OK,
            Message = $"Success executing {nameof(UpdateCampaignAsync)}",
            Content = response
        });
    }

    [Authorize]
    [HttpPost("DeleteCampaign")]
    public async Task<ActionResult<ApiSuccessResult<DeleteCampaignResult>>> DeleteCampaignAsync(DeleteCampaignRequest request, CancellationToken cancellationToken)
    {
        var response = await _sender.Send(request, cancellationToken);

        return Ok(new ApiSuccessResult<DeleteCampaignResult>
        {
            Code = StatusCodes.Status200OK,
            Message = $"Success executing {nameof(DeleteCampaignAsync)}",
            Content = response
        });
    }

    [Authorize]
    [HttpGet("GetCampaignList")]
    public async Task<ActionResult<ApiSuccessResult<GetCampaignListResult>>> GetCampaignListAsync(
        CancellationToken cancellationToken,
        [FromQuery] bool isDeleted = false
        )
    {
        var request = new GetCampaignListRequest { IsDeleted = isDeleted };
        var response = await _sender.Send(request, cancellationToken);

        return Ok(new ApiSuccessResult<GetCampaignListResult>
        {
            Code = StatusCodes.Status200OK,
            Message = $"Success executing {nameof(GetCampaignListAsync)}",
            Content = response
        });
    }


    [Authorize]
    [HttpGet("GetCampaignStatusList")]
    public async Task<ActionResult<ApiSuccessResult<GetCampaignStatusListResult>>> GetCampaignStatusListAsync(
        CancellationToken cancellationToken
        )
    {
        var request = new GetCampaignStatusListRequest { };
        var response = await _sender.Send(request, cancellationToken);

        return Ok(new ApiSuccessResult<GetCampaignStatusListResult>
        {
            Code = StatusCodes.Status200OK,
            Message = $"Success executing {nameof(GetCampaignStatusListAsync)}",
            Content = response
        });
    }


    [Authorize]
    [HttpGet("GetCampaignSingle")]
    public async Task<ActionResult<ApiSuccessResult<GetCampaignSingleResult>>> GetCampaignSingleAsync(
    CancellationToken cancellationToken,
    [FromQuery] string id
    )
    {
        var request = new GetCampaignSingleRequest { Id = id };
        var response = await _sender.Send(request, cancellationToken);

        return Ok(new ApiSuccessResult<GetCampaignSingleResult>
        {
            Code = StatusCodes.Status200OK,
            Message = $"Success executing {nameof(GetCampaignSingleAsync)}",
            Content = response
        });
    }



}
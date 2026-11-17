using Application.Features.BudgetManager.Commands;
using Application.Features.BudgetManager.Queries;
using ASPNET.BackEnd.Common.Base;
using ASPNET.BackEnd.Common.Models;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ASPNET.BackEnd.Controllers;

[Route("api/[controller]")]
public class BudgetController : BaseApiController
{
    public BudgetController(ISender sender) : base(sender)
    {
    }

    [Authorize(Roles = "Budgets")]
    [HttpPost("CreateBudget")]
    public async Task<ActionResult<ApiSuccessResult<CreateBudgetResult>>> CreateBudgetAsync(CreateBudgetRequest request, CancellationToken cancellationToken)
    {
        var response = await _sender.Send(request, cancellationToken);

        return Ok(new ApiSuccessResult<CreateBudgetResult>
        {
            Code = StatusCodes.Status200OK,
            Message = $"Success executing {nameof(CreateBudgetAsync)}",
            Content = response
        });
    }

    [Authorize(Roles = "Budgets")]
    [HttpPost("UpdateBudget")]
    public async Task<ActionResult<ApiSuccessResult<UpdateBudgetResult>>> UpdateBudgetAsync(UpdateBudgetRequest request, CancellationToken cancellationToken)
    {
        var response = await _sender.Send(request, cancellationToken);

        return Ok(new ApiSuccessResult<UpdateBudgetResult>
        {
            Code = StatusCodes.Status200OK,
            Message = $"Success executing {nameof(UpdateBudgetAsync)}",
            Content = response
        });
    }

    [Authorize(Roles = "Budgets")]
    [HttpPost("DeleteBudget")]
    public async Task<ActionResult<ApiSuccessResult<DeleteBudgetResult>>> DeleteBudgetAsync(DeleteBudgetRequest request, CancellationToken cancellationToken)
    {
        var response = await _sender.Send(request, cancellationToken);

        return Ok(new ApiSuccessResult<DeleteBudgetResult>
        {
            Code = StatusCodes.Status200OK,
            Message = $"Success executing {nameof(DeleteBudgetAsync)}",
            Content = response
        });
    }

    [Authorize(Roles = "Budgets,Campaigns")]
    [HttpGet("GetBudgetList")]
    public async Task<ActionResult<ApiSuccessResult<GetBudgetListResult>>> GetBudgetListAsync(
        CancellationToken cancellationToken,
        [FromQuery] bool isDeleted = false
        )
    {
        var request = new GetBudgetListRequest { IsDeleted = isDeleted };
        var response = await _sender.Send(request, cancellationToken);

        return Ok(new ApiSuccessResult<GetBudgetListResult>
        {
            Code = StatusCodes.Status200OK,
            Message = $"Success executing {nameof(GetBudgetListAsync)}",
            Content = response
        });
    }


    [Authorize(Roles = "Budgets,Campaigns")]
    [HttpGet("GetBudgetStatusList")]
    public async Task<ActionResult<ApiSuccessResult<GetBudgetStatusListResult>>> GetBudgetStatusListAsync(
        CancellationToken cancellationToken
        )
    {
        var request = new GetBudgetStatusListRequest { };
        var response = await _sender.Send(request, cancellationToken);

        return Ok(new ApiSuccessResult<GetBudgetStatusListResult>
        {
            Code = StatusCodes.Status200OK,
            Message = $"Success executing {nameof(GetBudgetStatusListAsync)}",
            Content = response
        });
    }


    [Authorize(Roles = "Budgets,Campaigns")]
    [HttpGet("GetBudgetSingle")]
    public async Task<ActionResult<ApiSuccessResult<GetBudgetSingleResult>>> GetBudgetSingleAsync(
    CancellationToken cancellationToken,
    [FromQuery] string id
    )
    {
        var request = new GetBudgetSingleRequest { Id = id };
        var response = await _sender.Send(request, cancellationToken);

        return Ok(new ApiSuccessResult<GetBudgetSingleResult>
        {
            Code = StatusCodes.Status200OK,
            Message = $"Success executing {nameof(GetBudgetSingleAsync)}",
            Content = response
        });
    }


    [Authorize(Roles = "Budgets,Campaigns")]
    [HttpGet("GetBudgetByCampaignIdList")]
    public async Task<ActionResult<ApiSuccessResult<GetBudgetByCampaignIdListResult>>> GetBudgetByCampaignIdListAsync(
    CancellationToken cancellationToken,
    [FromQuery] string campaignId
    )
    {
        var request = new GetBudgetByCampaignIdListRequest { CampaignId = campaignId };
        var response = await _sender.Send(request, cancellationToken);

        return Ok(new ApiSuccessResult<GetBudgetByCampaignIdListResult>
        {
            Code = StatusCodes.Status200OK,
            Message = $"Success executing {nameof(GetBudgetByCampaignIdListAsync)}",
            Content = response
        });
    }


}





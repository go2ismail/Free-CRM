using Application.Common.Services.ExpenseManager;
using Application.Features.ExpenseManager.Commands;
using Application.Features.ExpenseManager.Queries;
using ASPNET.BackEnd.Common.Base;
using ASPNET.BackEnd.Common.Models;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ASPNET.BackEnd.Controllers;

[Route("api/[controller]")]
public class ExpenseController : BaseApiController
{
    private readonly IExpenseService _expenseService;
    public ExpenseController(ISender sender, IExpenseService expenseService) : base(sender)
    {
        _expenseService = expenseService;
    }
    
    
    [HttpGet("ValidateExpense")]
    public async Task<IActionResult> ValidateExpense([FromQuery] string campaignId, [FromQuery] double amount, CancellationToken cancellationToken)
    {
        var result = await _expenseService.CheckBudgetAlertAsync(campaignId, amount, cancellationToken);

        if (result == null)
        {
            return Ok(new { Message = "No budget alert.", Alert = false });
        }

        return Ok(new { Message = "Budget alert triggered!", Alert = true, Data = result });
    }


    [Authorize]
    [HttpPost("CreateExpense")]
    public async Task<ActionResult<ApiSuccessResult<CreateExpenseResult>>> CreateExpenseAsync(CreateExpenseRequest request, CancellationToken cancellationToken)
    {
        var response = await _sender.Send(request, cancellationToken);

        return Ok(new ApiSuccessResult<CreateExpenseResult>
        {
            Code = StatusCodes.Status200OK,
            Message = $"Success executing {nameof(CreateExpenseAsync)}",
            Content = response
        });
    }

    [Authorize]
    [HttpPost("UpdateExpense")]
    public async Task<ActionResult<ApiSuccessResult<UpdateExpenseResult>>> UpdateExpenseAsync(UpdateExpenseRequest request, CancellationToken cancellationToken)
    {
        var response = await _sender.Send(request, cancellationToken);

        return Ok(new ApiSuccessResult<UpdateExpenseResult>
        {
            Code = StatusCodes.Status200OK,
            Message = $"Success executing {nameof(UpdateExpenseAsync)}",
            Content = response
        });
    }

    [Authorize]
    [HttpPost("DeleteExpense")]
    public async Task<ActionResult<ApiSuccessResult<DeleteExpenseResult>>> DeleteExpenseAsync(DeleteExpenseRequest request, CancellationToken cancellationToken)
    {
        var response = await _sender.Send(request, cancellationToken);

        return Ok(new ApiSuccessResult<DeleteExpenseResult>
        {
            Code = StatusCodes.Status200OK,
            Message = $"Success executing {nameof(DeleteExpenseAsync)}",
            Content = response
        });
    }

    [Authorize]
    [HttpGet("GetExpenseList")]
    public async Task<ActionResult<ApiSuccessResult<GetExpenseListResult>>> GetExpenseListAsync(
        CancellationToken cancellationToken,
        [FromQuery] bool isDeleted = false
        )
    {
        var request = new GetExpenseListRequest { IsDeleted = isDeleted };
        var response = await _sender.Send(request, cancellationToken);

        return Ok(new ApiSuccessResult<GetExpenseListResult>
        {
            Code = StatusCodes.Status200OK,
            Message = $"Success executing {nameof(GetExpenseListAsync)}",
            Content = response
        });
    }


    [Authorize]
    [HttpGet("GetExpenseStatusList")]
    public async Task<ActionResult<ApiSuccessResult<GetExpenseStatusListResult>>> GetExpenseStatusListAsync(
        CancellationToken cancellationToken
        )
    {
        var request = new GetExpenseStatusListRequest { };
        var response = await _sender.Send(request, cancellationToken);

        return Ok(new ApiSuccessResult<GetExpenseStatusListResult>
        {
            Code = StatusCodes.Status200OK,
            Message = $"Success executing {nameof(GetExpenseStatusListAsync)}",
            Content = response
        });
    }


    [Authorize]
    [HttpGet("GetExpenseSingle")]
    public async Task<ActionResult<ApiSuccessResult<GetExpenseSingleResult>>> GetExpenseSingleAsync(
    CancellationToken cancellationToken,
    [FromQuery] string id
    )
    {
        var request = new GetExpenseSingleRequest { Id = id };
        var response = await _sender.Send(request, cancellationToken);

        return Ok(new ApiSuccessResult<GetExpenseSingleResult>
        {
            Code = StatusCodes.Status200OK,
            Message = $"Success executing {nameof(GetExpenseSingleAsync)}",
            Content = response
        });
    }


    [Authorize]
    [HttpGet("GetExpenseByCampaignIdList")]
    public async Task<ActionResult<ApiSuccessResult<GetExpenseByCampaignIdListResult>>> GetExpenseByCampaignIdListAsync(
    CancellationToken cancellationToken,
    [FromQuery] string campaignId
    )
    {
        var request = new GetExpenseByCampaignIdListRequest { CampaignId = campaignId };
        var response = await _sender.Send(request, cancellationToken);

        return Ok(new ApiSuccessResult<GetExpenseByCampaignIdListResult>
        {
            Code = StatusCodes.Status200OK,
            Message = $"Success executing {nameof(GetExpenseByCampaignIdListAsync)}",
            Content = response
        });
    }


}



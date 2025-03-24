using Application.Features.ConfigManager;
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

    private readonly IMediator _mediator;
    public ExpenseController(ISender sender, IMediator mediator) : base(sender)
    {
        _mediator = mediator;
    }

    [Authorize]
    [HttpPost("CreateExpense")]
    public async Task<ActionResult<ApiSuccessResult<CreateExpenseResult>>> CreateExpenseAsync(CreateExpenseRequest request, CancellationToken cancellationToken, bool force)
    {
        try
        {

            AnalyseExpense analyse = new AnalyseExpense(_mediator);
            ConfigMethode configService = new ConfigMethode(_mediator);
            var config = await configService.GetConfigByNameAsync("AlertBudget");
            Console.WriteLine("CampaidnId");
            Console.WriteLine(request.CampaignId);

            if (await analyse.IsExpenseExceedingBudget(request.Amount ?? 0, request.CampaignId))
            {
                throw new Exception("Expense depasee le budget");
            }

            if (await analyse.IsExpenseExceedingBudgetAlert(request.Amount ?? 0, request.CampaignId, int.Parse(config), request.ExpenseDate.Value))
            {
                // Retourner un code spécial pour indiquer le dépassement de budget
                return Ok(new ApiSuccessResult<CreateExpenseResult>
                {
                    Code = 409, // Code personnalisé pour budget dépassé (Conflict)
                    Message = "Expense exceeds the budget. Do you want to continue?",
                    Content = null
                });
            }


            // Si pas de problème de budget ou si ForceCreate est true, continuer normalement
            var response = await _sender.Send(request, cancellationToken);
            return Ok(new ApiSuccessResult<CreateExpenseResult>
            {
                Code = StatusCodes.Status200OK,
                Message = $"Success executing {nameof(CreateExpenseAsync)}",
                Content = response
            });
        }
        catch (Exception ex)
        {
            return BadRequest(new ApiErrorResult
            {
                Code = StatusCodes.Status400BadRequest,
                Message = ex.Message
            });
        }
    }

    [Authorize]
    [HttpPost("CreateExpenseWitoutAlert")]
    public async Task<ActionResult<ApiSuccessResult<CreateExpenseResult>>> CreateExpenseAsyncW(CreateExpenseRequest request, CancellationToken cancellationToken, bool force)
    {
        try
        {

            // Si pas de problème de budget ou si ForceCreate est true, continuer normalement
            var response = await _sender.Send(request, cancellationToken);
            return Ok(new ApiSuccessResult<CreateExpenseResult>
            {
                Code = StatusCodes.Status200OK,
                Message = $"Success executing {nameof(CreateExpenseAsyncW)}",
                Content = response
            });
        }
        catch (Exception ex)
        {
            return BadRequest(new ApiErrorResult
            {
                Code = StatusCodes.Status400BadRequest,
                Message = ex.Message
            });
        }
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


    [Authorize]
    [HttpPost("UpdateConfig")]
    public async Task<ActionResult<ApiSuccessResult<UpdateConfigResult>>> UpdateConfigAsync(UpdateConfigRequest request, CancellationToken cancellationToken)
    {
        var response = await _sender.Send(request, cancellationToken);

        return Ok(new ApiSuccessResult<UpdateConfigResult>
        {
            Code = StatusCodes.Status200OK,
            Message = $"Success executing {nameof(UpdateConfigAsync)}",
            Content = response
        });
    }

    [Authorize]
    [HttpGet("GetConfigByName")]
    public async Task<ActionResult<ApiSuccessResult<GetConfigByNameResult>>> GetConfigByNameAsync(
    [FromQuery] string name,
    CancellationToken cancellationToken)
    {

        Console.WriteLine(name);
        var request = new GetConfigByNameRequest(name);
        var response = await _sender.Send(request, cancellationToken);

        return Ok(new ApiSuccessResult<GetConfigByNameResult>
        {
            Code = StatusCodes.Status200OK,
            Message = $"Success executing {nameof(GetConfigByNameAsync)}",
            Content = response
        });
    }


}



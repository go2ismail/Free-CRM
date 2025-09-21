using Application.Features.DashboardManager.Queries;
using ASPNET.BackEnd.Common.Base;
using ASPNET.BackEnd.Common.Models;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ASPNET.BackEnd.Controllers;

[Route("api/[controller]")]
public class DashboardController : BaseApiController
{
    public DashboardController(ISender sender) : base(sender)
    {
    }


    [Authorize]
    [HttpGet("GetCRMDashboard")]
    public async Task<ActionResult<ApiSuccessResult<GetCRMDashboardResult>>> GetCRMDashboardAsync(
        CancellationToken cancellationToken
        )
    {
        var request = new GetCRMDashboardRequest { };
        var response = await _sender.Send(request, cancellationToken);

        return Ok(new ApiSuccessResult<GetCRMDashboardResult>
        {
            Code = StatusCodes.Status200OK,
            Message = $"Success executing {nameof(GetCRMDashboardAsync)}",
            Content = response
        });
    }




    [Authorize]
    [HttpGet("GetLeadPipelineFunnel")]
    public async Task<ActionResult<ApiSuccessResult<GetLeadPipelineFunnelResult>>> GetLeadPipelineFunnelAsync(
        CancellationToken cancellationToken
        )
    {
        var request = new GetLeadPipelineFunnelRequest { };
        var response = await _sender.Send(request, cancellationToken);

        return Ok(new ApiSuccessResult<GetLeadPipelineFunnelResult>
        {
            Code = StatusCodes.Status200OK,
            Message = $"Success executing {nameof(GetLeadPipelineFunnelAsync)}",
            Content = response
        });
    }


    [Authorize]
    [HttpGet("GetSalesTeamLeadClosing")]
    public async Task<ActionResult<ApiSuccessResult<GetSalesTeamLeadClosingResult>>> GetSalesTeamLeadClosingAsync(
        CancellationToken cancellationToken
        )
    {
        var request = new GetSalesTeamLeadClosingRequest { };
        var response = await _sender.Send(request, cancellationToken);

        return Ok(new ApiSuccessResult<GetSalesTeamLeadClosingResult>
        {
            Code = StatusCodes.Status200OK,
            Message = $"Success executing {nameof(GetSalesTeamLeadClosingAsync)}",
            Content = response
        });
    }


    [Authorize]
    [HttpGet("GetCampaignByStatus")]
    public async Task<ActionResult<ApiSuccessResult<GetCampaignByStatusResult>>> GetCampaignByStatusAsync(
        CancellationToken cancellationToken
        )
    {
        var request = new GetCampaignByStatusRequest { };
        var response = await _sender.Send(request, cancellationToken);

        return Ok(new ApiSuccessResult<GetCampaignByStatusResult>
        {
            Code = StatusCodes.Status200OK,
            Message = $"Success executing {nameof(GetCampaignByStatusAsync)}",
            Content = response
        });
    }
    
    [Authorize]
    [HttpGet("GetCampaignBudget")]
    public async Task<ActionResult<ApiSuccessResult<GetDashboardCampaignBudgetResult>>> GetCampaignBudgetAsync(
        CancellationToken cancellationToken
    )
    {
        var request = new GetDashboardCampaignBudgetRequest() { };
        var response = await _sender.Send(request, cancellationToken);

        return Ok(new ApiSuccessResult<GetDashboardCampaignBudgetResult>
        {
            Code = StatusCodes.Status200OK,
            Message = $"Success executing {nameof(GetCampaignBudgetAsync)}",
            Content = response
        });
    }
    
    [Authorize]
    [HttpGet("GetCampaignExpense")]
    public async Task<ActionResult<ApiSuccessResult<GetDashboardCampaignExpenseResult>>> GetCampaignExpenseAsync(
        CancellationToken cancellationToken
    )
    {
        var request = new GetDashboardCampaignExpenseRequest() { };
        var response = await _sender.Send(request, cancellationToken);

        return Ok(new ApiSuccessResult<GetDashboardCampaignExpenseResult>
        {
            Code = StatusCodes.Status200OK,
            Message = $"Success executing {nameof(GetCampaignExpenseAsync)}",
            Content = response
        });
    }
    
    [Authorize]
    [HttpGet("GetCampaignBudgetExpense")]
    public async Task<ActionResult<ApiSuccessResult<GetDashboardCampaignBudgetExpenseResult>>> GetCampaignBudgetExpenseAsync(
        CancellationToken cancellationToken
    )
    {
        var request = new GetDashboardCampaignBudgetExpenseRequest() { };
        var response = await _sender.Send(request, cancellationToken);

        return Ok(new ApiSuccessResult<GetDashboardCampaignBudgetExpenseResult>
        {
            Code = StatusCodes.Status200OK,
            Message = $"Success executing {nameof(GetCampaignBudgetExpenseAsync)}",
            Content = response
        });
    }


    [Authorize]
    [HttpGet("GetLeadActivityByType")]
    public async Task<ActionResult<ApiSuccessResult<GetLeadActivityByTypeResult>>> GetLeadActivityByTypeAsync(
        CancellationToken cancellationToken
        )
    {
        var request = new GetLeadActivityByTypeRequest { };
        var response = await _sender.Send(request, cancellationToken);

        return Ok(new ApiSuccessResult<GetLeadActivityByTypeResult>
        {
            Code = StatusCodes.Status200OK,
            Message = $"Success executing {nameof(GetLeadActivityByTypeAsync)}",
            Content = response
        });
    }


    [Authorize]
    [HttpGet("GetCardsDashboard")]
    public async Task<ActionResult<ApiSuccessResult<GetCardsDashboardResult>>> GetCardsDashboardAsync(
        CancellationToken cancellationToken
        )
    {
        var request = new GetCardsDashboardRequest { };
        var response = await _sender.Send(request, cancellationToken);

        return Ok(new ApiSuccessResult<GetCardsDashboardResult>
        {
            Code = StatusCodes.Status200OK,
            Message = $"Success executing {nameof(GetCardsDashboardAsync)}",
            Content = response
        });
    }


    [Authorize]
    [HttpGet("GetSalesDashboard")]
    public async Task<ActionResult<ApiSuccessResult<GetSalesDashboardResult>>> GetSalesDashboardAsync(
        CancellationToken cancellationToken
        )
    {
        var request = new GetSalesDashboardRequest { };
        var response = await _sender.Send(request, cancellationToken);

        return Ok(new ApiSuccessResult<GetSalesDashboardResult>
        {
            Code = StatusCodes.Status200OK,
            Message = $"Success executing {nameof(GetSalesDashboardAsync)}",
            Content = response
        });
    }


    [Authorize]
    [HttpGet("GetPurchaseDashboard")]
    public async Task<ActionResult<ApiSuccessResult<GetPurchaseDashboardResult>>> GetPurchaseDashboardAsync(
        CancellationToken cancellationToken
        )
    {
        var request = new GetPurchaseDashboardRequest { };
        var response = await _sender.Send(request, cancellationToken);

        return Ok(new ApiSuccessResult<GetPurchaseDashboardResult>
        {
            Code = StatusCodes.Status200OK,
            Message = $"Success executing {nameof(GetPurchaseDashboardAsync)}",
            Content = response
        });
    }




}



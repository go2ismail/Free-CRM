using JavaDashboardManager.Queries;
using ASPNET.BackEnd.Common.Base;
using ASPNET.BackEnd.Common.Models;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace ASPNET.BackEnd.Controllers;

[Route("api/[controller]")]
public class JavaDashboardController : BaseApiController
{
    public JavaDashboardController(ISender sender) : base(sender)
    {
    }

    [HttpGet("GetTotalDashboard")]
    public async Task<ActionResult<ApiSuccessResult<GetTotalDashboardResult>>> GetTotalDashboardAsync(
        [FromQuery] DateTime? dateDebut,
        [FromQuery] DateTime? dateFin,
        CancellationToken cancellationToken
    )
    {
        var request = new GetTotalDashboardRequest
        {
            DateDebut = dateDebut,
            DateFin = dateFin
        };

        var response = await _sender.Send(request, cancellationToken);

        return Ok(new ApiSuccessResult<GetTotalDashboardResult>
        {
            Code = StatusCodes.Status200OK,
            Message = $"Success executing {nameof(GetTotalDashboardAsync)}",
            Content = response
        });
    }

    [HttpGet("GetExpenseProgressByCampaign")]
    public async Task<ActionResult<ApiSuccessResult<GetExpenseProgressByCampaignResult>>> GetExpenseProgressByCampaignAsync(
        [FromQuery] DateTime? dateDebut,
        [FromQuery] DateTime? dateFin,
        CancellationToken cancellationToken
    )
    {
        var request = new GetExpenseProgressByCampaignRequest
        {
            DateDebut = dateDebut,
            DateFin = dateFin
        };

        var response = await _sender.Send(request, cancellationToken);

        return Ok(new ApiSuccessResult<GetExpenseProgressByCampaignResult>
        {
            Code = StatusCodes.Status200OK,
            Message = $"Success executing {nameof(GetExpenseProgressByCampaignAsync)}",
            Content = response
        });
    } 

    [HttpGet("GetBudgetProgressByCampaign")]
    public async Task<ActionResult<ApiSuccessResult<GetBudgetProgressByCampaignResult>>> GetBudgetProgressByCampaignAsync(
        [FromQuery] DateTime? dateDebut,
        [FromQuery] DateTime? dateFin,
        CancellationToken cancellationToken
    )
    {
        var request = new GetBudgetProgressByCampaignRequest
        {
            DateDebut = dateDebut,
            DateFin = dateFin
        };

        var response = await _sender.Send(request, cancellationToken);

        return Ok(new ApiSuccessResult<GetBudgetProgressByCampaignResult>
        {
            Code = StatusCodes.Status200OK,
            Message = $"Success executing {nameof(GetBudgetProgressByCampaignAsync)}",
            Content = response
        });
    }

    [HttpGet("GetCampaignDistributionBySalesTeam")]
    public async Task<ActionResult<ApiSuccessResult<GetCampaignDistributionBySalesTeamResult>>> GetCampaignDistributionBySalesTeamAsync(
        [FromQuery] DateTime? dateDebut,
        [FromQuery] DateTime? dateFin,
        CancellationToken cancellationToken
    )
    {
        var request = new GetCampaignDistributionBySalesTeamRequest
        {
            DateDebut = dateDebut,
            DateFin = dateFin
        };

        var response = await _sender.Send(request, cancellationToken);

        return Ok(new ApiSuccessResult<GetCampaignDistributionBySalesTeamResult>
        {
            Code = StatusCodes.Status200OK,
            Message = $"Success executing {nameof(GetCampaignDistributionBySalesTeamAsync)}",
            Content = response
        });
    }
}

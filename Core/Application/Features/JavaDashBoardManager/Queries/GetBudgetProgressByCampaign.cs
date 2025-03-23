using Application.Common.CQS.Queries;
using Application.Common.Extensions;
using Domain.Enums;
using Domain.Entities;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace JavaDashboardManager.Queries;

public class BudgetProgressByCampaignDto
{
    public Campaign? CampaignDetails { get; init; }
    public Dictionary<BudgetStatus, int>? BudgetCountByStatus { get; init; }
}

public class GetBudgetProgressByCampaignResult
{
    public List<BudgetProgressByCampaignDto>? Data { get; init; }
}

public class GetBudgetProgressByCampaignRequest : IRequest<GetBudgetProgressByCampaignResult>
{
    public DateTime? DateDebut { get; init; }
    public DateTime? DateFin { get; init; }
}

public class GetBudgetProgressByCampaignHandler : IRequestHandler<GetBudgetProgressByCampaignRequest, GetBudgetProgressByCampaignResult>
{
    private readonly IQueryContext _context;

    public GetBudgetProgressByCampaignHandler(IQueryContext context)
    {
        _context = context;
    }

    public async Task<GetBudgetProgressByCampaignResult> Handle(GetBudgetProgressByCampaignRequest request, CancellationToken cancellationToken)
    {
        var campaignQuery = _context.Campaign
            .AsNoTracking()
            .IsDeletedEqualTo(false);

        var campaigns = await campaignQuery.ToListAsync(cancellationToken);

        var campaignProgressData = new List<BudgetProgressByCampaignDto>();

        foreach (var campaign in campaigns)
        {
            var budgetQuery = _context.Budget
                .AsNoTracking()
                .IsDeletedEqualTo(false)
                .Where(x => x.CampaignId == campaign.Id);

            if (request.DateDebut.HasValue)
            {
                budgetQuery = budgetQuery.Where(x => x.BudgetDate >= request.DateDebut.Value);
            }

            if (request.DateFin.HasValue)
            {
                budgetQuery = budgetQuery.Where(x => x.BudgetDate <= request.DateFin.Value);
            }

            var budgets = await budgetQuery.ToListAsync(cancellationToken);

            // Inclure tous les statuts possibles dans BudgetStatus
            var budgetCountByStatus = Enum.GetValues(typeof(BudgetStatus))
                .Cast<BudgetStatus>()
                .ToDictionary(
                    status => status, // Inclure chaque statut comme clé
                    status => budgets.Count(b => b.Status.HasValue && b.Status.Value == status) // Compter les budgets correspondant
                );

            campaignProgressData.Add(new BudgetProgressByCampaignDto
            {
                CampaignDetails = campaign,
                BudgetCountByStatus = budgetCountByStatus
            });
        }

        return new GetBudgetProgressByCampaignResult
        {
            Data = campaignProgressData
        };
    }
}

using Application.Common.CQS.Queries;
using Application.Common.Extensions;
using Domain.Entities;
using Domain.Enums;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Application.Features.DashboardManager.Queries;

public class GetDashboardCampaignBudgetResult
{
    public List<CampaignBudgetItem>? Data { get; init; }
}

public class GetDashboardCampaignExpenseResult
{
    public List<CampaignExpenseItem>? Data { get; init; }
}

public class GetDashboardCampaignBudgetExpenseResult
{
    public List<CampaignBudgetExpenseItem>? Data { get; init; }
}

public class GetDashboardCampaignBudgetRequest : IRequest<GetDashboardCampaignBudgetResult>
{
}

public class GetDashboardCampaignExpenseRequest : IRequest<GetDashboardCampaignExpenseResult>
{
}

public class GetDashboardCampaignBudgetExpenseRequest : IRequest<GetDashboardCampaignBudgetExpenseResult>
{
}

public class GetDashboardCampaignBudgetHandler : IRequestHandler<GetDashboardCampaignBudgetRequest, GetDashboardCampaignBudgetResult>
{
    private readonly IQueryContext _context;

    public GetDashboardCampaignBudgetHandler(IQueryContext context)
    {
        _context = context;
    }

    public async Task<GetDashboardCampaignBudgetResult> Handle(GetDashboardCampaignBudgetRequest request, CancellationToken cancellationToken)
    {
        var campaignBudgets = await _context.Set<Campaign>()
            .AsNoTracking()
            .IsDeletedEqualTo(false)
            // .Where(campaign => campaign.Status == CampaignStatus.Confirmed)
            .GroupJoin(
                _context.Set<Budget>(),
                campaign => campaign.Id,
                budget => budget.CampaignId,
                (campaign, budgets) => new
                {
                    CampaignName = campaign.Title,
                    TotalBudget = budgets.Sum(b => b.Amount)
                })
            .ToListAsync(cancellationToken);
        
        var result = campaignBudgets
            .Select(cb => new CampaignBudgetItem
            {
                CampaignName = cb.CampaignName,
                CampaignBudget = cb.TotalBudget
            })
            .ToList();
        
        return new GetDashboardCampaignBudgetResult { Data = result };
    }
}

public class GetDashboardCampaignExpenseHandler : IRequestHandler<GetDashboardCampaignExpenseRequest, GetDashboardCampaignExpenseResult>
{
    private readonly IQueryContext _context;

    public GetDashboardCampaignExpenseHandler(IQueryContext context)
    {
        _context = context;
    }

    public async Task<GetDashboardCampaignExpenseResult> Handle(GetDashboardCampaignExpenseRequest request, CancellationToken cancellationToken)
    {
        var campaignExpenses = await _context.Set<Campaign>()
            .AsNoTracking()
            .IsDeletedEqualTo(false)
            // Optionnel : .Where(campaign => campaign.Status == CampaignStatus.Confirmed)
            .GroupJoin(
                _context.Set<Expense>(),
                campaign => campaign.Id,
                expense => expense.CampaignId,
                (campaign, expenses) => new
                {
                    CampaignName = campaign.Title,
                    ExpensesByDate = expenses
                        .Where(e => e.ExpenseDate.HasValue)
                        .GroupBy(e => e.ExpenseDate.Value.Date)
                        .Select(g => new
                        {
                            ExpenseDate = g.Key,
                            TotalExpense = g.Sum(e => e.Amount)
                        })
                }
            )
            .ToListAsync(cancellationToken);
        
        var result = campaignExpenses
            .SelectMany(ce => ce.ExpensesByDate.Select(exp => new CampaignExpenseItem
            {
                ExpenseDate = exp.ExpenseDate,
                CampaignExpense = exp.TotalExpense
            }))
            .OrderBy(exp => exp.ExpenseDate) 
            .ToList();

        return new GetDashboardCampaignExpenseResult { Data = result };
    }


}

public class GetDashboardCampaignBudgetExpenseHandler : IRequestHandler<GetDashboardCampaignBudgetExpenseRequest, GetDashboardCampaignBudgetExpenseResult>
{
    private readonly IQueryContext _context;

    public GetDashboardCampaignBudgetExpenseHandler(IQueryContext context)
    {
        _context = context;
    }

    public async Task<GetDashboardCampaignBudgetExpenseResult> Handle(GetDashboardCampaignBudgetExpenseRequest request, CancellationToken cancellationToken)
    {
        var result = await _context.Set<Campaign>()
            .AsNoTracking()
            .IsDeletedEqualTo(false)
            // Optionnel : .Where(campaign => campaign.Status == CampaignStatus.Confirmed)
            .Select(c => new CampaignBudgetExpenseItem
            {
                CampaignName = c.Title,
                CampaignBudget = _context.Set<Budget>()
                    .Where(b => b.CampaignId == c.Id)
                    .Sum(b => (double?)b.Amount) ?? 0.0,
                CampaignExpense = _context.Set<Expense>()
                    .Where(e => e.CampaignId == c.Id)
                    .Sum(e => (double?)e.Amount) ?? 0.0
            })
            .Where(item => item.CampaignBudget > 0 && item.CampaignExpense > 0)
            .ToListAsync(cancellationToken);

        return new GetDashboardCampaignBudgetExpenseResult { Data = result };
    }

}
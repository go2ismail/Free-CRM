using Application.Common.CQS.Queries;
using Application.Common.Extensions;
using Application.Features.DashboardManager.Queries;
using Domain.Entities;
using Domain.Enums;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace JavaDashboardManager.Queries;

public class GetTotalDashboardDto
{
    public JavaItem? JavaDashboard { get; init; }
    public List<Campaign>? Campaigns { get; init; }
    public List<Budget>? Budgets { get; init; }   
    public List<Expense>? Expenses { get; init; }
}

public class GetTotalDashboardResult
{
    public GetTotalDashboardDto? Data { get; init; }
}

public class GetTotalDashboardRequest : IRequest<GetTotalDashboardResult>
{
    public DateTime? DateDebut { get; init; } 
    public DateTime? DateFin { get; init; } 
}

public class GetTotalDashboardHandler : IRequestHandler<GetTotalDashboardRequest, GetTotalDashboardResult>
{
    private readonly IQueryContext _context;

    public GetTotalDashboardHandler(IQueryContext context)
    {
        _context = context;
    }

    public async Task<GetTotalDashboardResult> Handle(GetTotalDashboardRequest request, CancellationToken cancellationToken)
    {
        var campaignQuery = _context.Campaign
            .AsNoTracking()
            .IsDeletedEqualTo(false);

        if (request.DateDebut.HasValue)
        {
            campaignQuery = campaignQuery.Where(x => x.CampaignDateStart >= request.DateDebut.Value);
        }

        if (request.DateFin.HasValue)
        {
            campaignQuery = campaignQuery.Where(x => x.CampaignDateFinish <= request.DateFin.Value);
        }

        var campaigns = await campaignQuery.ToListAsync(cancellationToken);
        var campaignTotalAmount = campaigns.Sum(x => (double?)x.TargetRevenueAmount);

        var budgetQuery = _context.Budget
            .AsNoTracking()
            .IsDeletedEqualTo(false);

        if (request.DateDebut.HasValue)
        {
            budgetQuery = budgetQuery.Where(x => x.BudgetDate >= request.DateDebut.Value);
        }

        if (request.DateFin.HasValue)
        {
            budgetQuery = budgetQuery.Where(x => x.BudgetDate <= request.DateFin.Value);
        }

        var budgets = await budgetQuery.ToListAsync(cancellationToken);
        var budgetTotalAmount = budgets.Sum(x => (double?)x.Amount);

        var expenseQuery = _context.Expense
            .AsNoTracking()
            .IsDeletedEqualTo(false);

        if (request.DateDebut.HasValue)
        {
            expenseQuery = expenseQuery.Where(x => x.ExpenseDate >= request.DateDebut.Value);
        }

        if (request.DateFin.HasValue)
        {
            expenseQuery = expenseQuery.Where(x => x.ExpenseDate <= request.DateFin.Value);
        }

        var expenses = await expenseQuery.ToListAsync(cancellationToken);
        var expenseTotalAmount = expenses.Sum(x => (double?)x.Amount);

        var cardsDashboardData = new JavaItem()
        {
            CampaignTotalAmount = campaignTotalAmount,
            BudgetTotalAmount = budgetTotalAmount,
            ExpenseTotalAmount = expenseTotalAmount,
        };

        var result = new GetTotalDashboardResult
        {
            Data = new GetTotalDashboardDto
            {
                JavaDashboard = cardsDashboardData,
                Campaigns = campaigns, 
                Budgets = budgets,    
                Expenses = expenses  
            }
        };
        return result;
    }
}


using Application.Common.CQS.Queries;
using Application.Common.Extensions;
using Domain.Enums;
using Domain.Entities;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace JavaDashboardManager.Queries;

public class ExpenseProgressByCampaignDto
{
    public Campaign? CampaignDetails { get; init; } 
    public Dictionary<ExpenseStatus, int>? ExpenseCountByStatus { get; init; } 
}

public class GetExpenseProgressByCampaignResult
{
    public List<ExpenseProgressByCampaignDto>? Data { get; init; }
}

public class GetExpenseProgressByCampaignRequest : IRequest<GetExpenseProgressByCampaignResult>
{
    public DateTime? DateDebut { get; init; } 
    public DateTime? DateFin { get; init; }  
}

public class GetExpenseProgressByCampaignHandler : IRequestHandler<GetExpenseProgressByCampaignRequest, GetExpenseProgressByCampaignResult>
{
    private readonly IQueryContext _context;

    public GetExpenseProgressByCampaignHandler(IQueryContext context)
    {
        _context = context;
    }

    public async Task<GetExpenseProgressByCampaignResult> Handle(GetExpenseProgressByCampaignRequest request, CancellationToken cancellationToken)
    {
        var campaignQuery = _context.Campaign
            .AsNoTracking()
            .IsDeletedEqualTo(false);

        var campaigns = await campaignQuery.ToListAsync(cancellationToken);

        var campaignProgressData = new List<ExpenseProgressByCampaignDto>();

        foreach (var campaign in campaigns)
        {
            var expenseQuery = _context.Expense
                .AsNoTracking()
                .IsDeletedEqualTo(false)
                .Where(x => x.CampaignId == campaign.Id);

            if (request.DateDebut.HasValue)
            {
                expenseQuery = expenseQuery.Where(x => x.ExpenseDate >= request.DateDebut.Value);
            }

            if (request.DateFin.HasValue)
            {
                expenseQuery = expenseQuery.Where(x => x.ExpenseDate <= request.DateFin.Value);
            }

            var expenses = await expenseQuery.ToListAsync(cancellationToken);

            var expenseCountByStatus = Enum.GetValues(typeof(ExpenseStatus))
                .Cast<ExpenseStatus>()
                .ToDictionary(
                    status => status,
                    status => expenses.Where(x => x.Status.HasValue && x.Status.Value == status).Count()
                );

            campaignProgressData.Add(new ExpenseProgressByCampaignDto
            {
                CampaignDetails = campaign,
                ExpenseCountByStatus = expenseCountByStatus
            });
        }

        return new GetExpenseProgressByCampaignResult
        {
            Data = campaignProgressData
        };
        
        
        

    }
}

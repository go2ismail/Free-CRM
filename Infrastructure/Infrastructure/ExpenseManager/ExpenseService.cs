using Application.Common.Services.ExpenseManager;
using Domain.Entities;
using Domain.Enums;
using Infrastructure.DataAccessManager.EFCore.Contexts;
using Microsoft.EntityFrameworkCore;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace Infrastructure.ExpenseManager;

public class ExpenseService : IExpenseService
{
    private readonly DataContext _context;

    public ExpenseService(DataContext context)
    {
        _context = context;
    }
    
    public async Task<BudgetAlertResult?> CheckBudgetAlertAsync(string campaignId, double newAmount, CancellationToken cancellationToken = default)
    {
        if (string.IsNullOrEmpty(campaignId) || newAmount == 0)
            return null;
        var totalExpenses = await _context.Expense
            .Where(x => x.CampaignId == campaignId && x.Status == ExpenseStatus.Confirmed && x.IsDeleted == false)
            .SumAsync(x => x.Amount ?? 0, cancellationToken);
        var totalBudget = await _context.Budget
            .Where(x => x.CampaignId == campaignId && x.Status == BudgetStatus.Confirmed && x.IsDeleted == false)
            .SumAsync(x => x.Amount ?? 0, cancellationToken);
        double budgetAlertThreshold = await _context.ParamSettings
            .Where(x => x.ParamName == "budgetalert")
            .Select(x => (double?)x.ParamValue) 
            .FirstOrDefaultAsync(cancellationToken) ?? 100;
       
        if (totalBudget > 0 && totalExpenses + newAmount >= (budgetAlertThreshold / 100) * totalBudget)
        {
            return new BudgetAlertResult
            {
                TotalExpenses = totalExpenses,
                TotalBudget = totalBudget,
                BudgetAlertThreshold = budgetAlertThreshold
            };
        }

        return null;
    }
}

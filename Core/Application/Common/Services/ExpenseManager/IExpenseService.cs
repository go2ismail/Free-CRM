using Domain.Entities;

namespace Application.Common.Services.ExpenseManager;

public interface IExpenseService
{
    Task<BudgetAlertResult?> CheckBudgetAlertAsync(string campaignId, double newAmount,  CancellationToken cancellationToken = default);
}
using Application.Features.ExpenseManager.Commands;
using MediatR;

namespace Application.Common.Services.ExpenseManager;

public class BudgetAlertResult  : IRequest<CreateExpenseResult>
{
    public double TotalExpenses { get; set; }
    public double TotalBudget { get; set; }
    public double BudgetAlertThreshold { get; set; }
}
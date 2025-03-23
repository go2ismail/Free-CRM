namespace Application.Features.DashboardManager.Queries;

public class CampaignBudgetExpenseItem
{
    public string CampaignName { get; init; } = string.Empty;
    public double? CampaignBudget { get; init; } = 0.0;
    public double? CampaignExpense { get; init; } = 0.0;
}

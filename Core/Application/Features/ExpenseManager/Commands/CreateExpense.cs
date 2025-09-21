using Application.Common.Repositories;
using Application.Features.BudgetManager.Queries;
using Application.Features.ConfigManager;
using Application.Features.ExpenseManager.Queries;
using Application.Features.NumberSequenceManager;
using Domain.Entities;
using Domain.Enums;
using FluentValidation;
using MediatR;

namespace Application.Features.ExpenseManager.Commands;

public class CreateExpenseResult
{
    public Expense? Data { get; set; }
}

public class CreateExpenseRequest : IRequest<CreateExpenseResult>
{
    public string? Title { get; init; }
    public string? Description { get; init; }
    public DateTime? ExpenseDate { get; init; }
    public string? Status { get; init; }
    public double? Amount { get; init; }
    public string? CampaignId { get; init; }
    public string? CreatedById { get; init; }
}

public class CreateExpenseValidator : AbstractValidator<CreateExpenseRequest>
{
    public CreateExpenseValidator()
    {
        RuleFor(x => x.Title).NotEmpty();
        RuleFor(x => x.ExpenseDate).NotNull();
        RuleFor(x => x.Amount).NotNull();
        RuleFor(x => x.CampaignId).NotEmpty();
        RuleFor(x => x.Status).NotEmpty();
    }
}

public class CreateExpenseHandler : IRequestHandler<CreateExpenseRequest, CreateExpenseResult>
{
    private readonly ICommandRepository<Expense> _repository;
    private readonly IUnitOfWork _unitOfWork;
    private readonly NumberSequenceService _numberSequenceService;
    private readonly IMediator _mediator;

    public CreateExpenseHandler(
        ICommandRepository<Expense> repository,
        IUnitOfWork unitOfWork,
        NumberSequenceService numberSequenceService,
        IMediator mediator
    )
    {
        _repository = repository;
        _unitOfWork = unitOfWork;
        _numberSequenceService = numberSequenceService;
        _mediator = mediator;
    }

    public async Task<CreateExpenseResult> Handle(CreateExpenseRequest request, CancellationToken cancellationToken = default)
    {
        var entity = new Expense
        {
            CreatedById = request.CreatedById,
            Number = _numberSequenceService.GenerateNumber(nameof(Expense), "", "EXP"),
            Title = request.Title,
            Description = request.Description,
            ExpenseDate = request.ExpenseDate,
            Status = (ExpenseStatus)int.Parse(request.Status!),
            Amount = request.Amount,
            CampaignId = request.CampaignId
        };

        //AnalyseExpense analyse= new AnalyseExpense(_mediator);
        //ConfigMethode configService = new ConfigMethode(_mediator);
        //var config = await configService.GetConfigByNameAsync("AlertBudget");

        //Console.WriteLine("Valeur de la config");
        //Console.WriteLine(config);

        //if (await analyse.IsExpenseExceedingBudget(entity.Amount ?? 0, entity.CampaignId, int.Parse(config) ))
        //{
        //    throw new Exception("Expense exceeds the budget.");
        //}

        await _repository.CreateAsync(entity, cancellationToken);
        await _unitOfWork.SaveAsync(cancellationToken);

        return new CreateExpenseResult
        {
            Data = entity
        };
    }
}

public class AnalyseExpense
{

    private readonly IMediator _mediator;


    public AnalyseExpense(IMediator mediator)
    {
        _mediator = mediator;
    }

    public async Task<bool> IsExpenseExceedingBudgetAlert(double amount, string idCampaign, int? alert, DateTime date)
    {
        // Get the list of budgets for the campaign using GetBudgetByCampaignIdListRequest
        var budgetRequest = new GetBudgetByCampaignIdListRequest { CampaignId = idCampaign };
        var budgetResult = await _mediator.Send(budgetRequest);
        var budgets = budgetResult.Data;
        if (budgets == null || !budgets.Any())
        {
            throw new Exception("No budgets found for the campaign.");
        }


        var expensesRequest = new GetExpenseByCampaignIdListRequest { CampaignId = idCampaign };
        var expensesResult = await _mediator.Send(expensesRequest);

        // Get the list of confirmed expenses for the campaign
        var expenses = expensesResult.Data;

        // Filter expenses to only include confirmed ones
        var confirmedExpenses = expenses.Where(e => e.Status == ExpenseStatus.Confirmed);
        var confirmedBudget = budgets.Where(e => e.Status == BudgetStatus.Confirmed);

        var budgetBeforDate = confirmedBudget.Where(b => b.BudgetDate <= date);

        // Calculate the total budget
        double totalBudget = budgetBeforDate.Sum(b => b.Amount ?? 0);

        // Calculate the total confirmed expenses
        double totalExpenses = confirmedExpenses.Sum(e => e.Amount ?? 0) + amount;

        Console.WriteLine("bugetAvecLimte");
        Console.WriteLine(alert);
        Console.WriteLine(totalBudget);

        Console.WriteLine(totalBudget - ((totalBudget * alert) / 100));

        return totalExpenses > totalBudget - ((totalBudget * alert) / 100);
    }

    public async Task<bool> IsExpenseExceedingBudget(double amount, string idCampaign)
    {
        // Get the list of budgets for the campaign using GetBudgetByCampaignIdListRequest
        var budgetRequest = new GetBudgetByCampaignIdListRequest { CampaignId = idCampaign };
        var budgetResult = await _mediator.Send(budgetRequest);
        var budgets = budgetResult.Data;
        if (budgets == null || !budgets.Any())
        {
            throw new Exception("No budgets found for the campaign.");
        }


        var expensesRequest = new GetExpenseByCampaignIdListRequest { CampaignId = idCampaign };
        var expensesResult = await _mediator.Send(expensesRequest);

        // Get the list of confirmed expenses for the campaign
        var expenses = expensesResult.Data;

        // Filter expenses to only include confirmed ones
        var confirmedExpenses = expenses.Where(e => e.Status == ExpenseStatus.Confirmed);

        // Calculate the total budget
        double totalBudget = budgets.Sum(b => b.Amount ?? 0);

        // Calculate the total confirmed expenses
        double totalExpenses = confirmedExpenses.Sum(e => e.Amount ?? 0) + amount;

        return totalExpenses > totalBudget;
    }
}
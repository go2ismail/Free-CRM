using Application.Common.CQS.Queries;
using Application.Common.Extensions;
using Application.Common.Repositories;
using Application.Features.NumberSequenceManager;
using Domain.Entities;
using Domain.Enums;
using FluentValidation;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Application.Features.ExpenseManager.Commands;

public class CreateExpenseResult
{
    public Expense? Data { get; set; }
}

public class CreateExpense2Result
{
    public Expense? Data { get; set; }
    public string? Message { get; set; }
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

public class CreateExpense2Request : IRequest<CreateExpense2Result>
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

public class CreateExpense2Validator : AbstractValidator<CreateExpense2Request>
{
    public CreateExpense2Validator()
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

    public CreateExpenseHandler(
        ICommandRepository<Expense> repository,
        IUnitOfWork unitOfWork,
        NumberSequenceService numberSequenceService
    )
    {
        _repository = repository;
        _unitOfWork = unitOfWork;
        _numberSequenceService = numberSequenceService;
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

        await _repository.CreateAsync(entity, cancellationToken);
        await _unitOfWork.SaveAsync(cancellationToken);

        return new CreateExpenseResult
        {
            Data = entity
        };
    }
    
}
public class CreateExpense2Handler : IRequestHandler<CreateExpense2Request, CreateExpense2Result>
{
    private readonly ICommandRepository<Expense> _repository;
    private readonly IUnitOfWork _unitOfWork;
    private readonly NumberSequenceService _numberSequenceService;
    private readonly IQueryContext _context;

    public CreateExpense2Handler(
        ICommandRepository<Expense> repository,
        IUnitOfWork unitOfWork,
        NumberSequenceService numberSequenceService,
        IQueryContext context
    )
    {
        _repository = repository;
        _unitOfWork = unitOfWork;
        _numberSequenceService = numberSequenceService;
        _context = context;
    }

    public async Task<CreateExpense2Result> Handle(CreateExpense2Request request, CancellationToken cancellationToken = default)
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
        
        var totalBudget = await _context
            .Budget
            .AsNoTracking()
            .IsDeletedEqualTo(false)
            .Where(b => b.CampaignId == request.CampaignId)
            .Select(b => b.Amount) 
            .SumAsync(); 
        
        var totalExpense = await _context
            .Expense
            .AsNoTracking()
            .IsDeletedEqualTo(false)
            .Where(b => b.CampaignId == request.CampaignId)
            .Select(e => e.Amount) 
            .SumAsync(); 

        var condition = _context
            .Rate
            .AsNoTracking()
            .Where(x => x.ValidateDate <= request.ExpenseDate && x.ExpiringeDate >= request.ExpenseDate)
            .OrderBy(rate => rate.ValidateDate)
            .AsQueryable();

        var list = await condition.ToListAsync(cancellationToken);

        var rate = list[0];

        if (rate != null && totalExpense != 0 && totalBudget != 0)
        {
            var limit = (totalBudget * rate.Ratio) / 100;
            
            if (totalExpense + request.Amount >= limit)
            {
                return new CreateExpense2Result
                {
                    Data = entity,
                    Message = $"Remaining amount: {limit - totalExpense}."
                };
            }
        }
        
        await _repository.CreateAsync(entity, cancellationToken);
        await _unitOfWork.SaveAsync(cancellationToken);

        return new CreateExpense2Result
        {
            Data = entity
        };
    }
}
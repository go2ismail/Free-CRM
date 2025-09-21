using Application.Common.Repositories;
using Domain.Entities;
using Domain.Enums;
using FluentValidation;
using MediatR;

namespace Application.Features.ExpenseManager.Commands;

public class UpdateExpenseResult
{
    public Expense? Data { get; set; }
}

public class UpdateExpenseRequest : IRequest<UpdateExpenseResult>
{
    public string? Id { get; init; }
    public string? Title { get; init; }
    public string? Description { get; init; }
    public DateTime? ExpenseDate { get; init; }
    public string? Status { get; init; }
    public double? Amount { get; init; }
    public string? CampaignId { get; init; }
    public string? UpdatedById { get; init; }
}

public class UpdateExpenseValidator : AbstractValidator<UpdateExpenseRequest>
{
    public UpdateExpenseValidator()
    {
        RuleFor(x => x.Id).NotEmpty();
        RuleFor(x => x.Title).NotEmpty();
        RuleFor(x => x.ExpenseDate).NotNull();
        RuleFor(x => x.Amount).NotNull().GreaterThan(0);
        RuleFor(x => x.CampaignId).NotEmpty();
        RuleFor(x => x.Status).NotEmpty();
    }
}

public class UpdateExpenseHandler : IRequestHandler<UpdateExpenseRequest, UpdateExpenseResult>
{
    private readonly ICommandRepository<Expense> _repository;
    private readonly IUnitOfWork _unitOfWork;

    public UpdateExpenseHandler(
        ICommandRepository<Expense> repository,
        IUnitOfWork unitOfWork
    )
    {
        _repository = repository;
        _unitOfWork = unitOfWork;
    }

    public async Task<UpdateExpenseResult> Handle(UpdateExpenseRequest request, CancellationToken cancellationToken)
    {
        var entity = await _repository.GetAsync(request.Id ?? string.Empty, cancellationToken);

        if (entity == null)
        {
            throw new Exception($"Entity not found: {request.Id}");
        }

        entity.UpdatedById = request.UpdatedById;
        entity.Title = request.Title;
        entity.Description = request.Description;
        entity.ExpenseDate = request.ExpenseDate;
        entity.Status = (ExpenseStatus)int.Parse(request.Status!);
        entity.Amount = request.Amount;
        entity.CampaignId = request.CampaignId;

        _repository.Update(entity);
        await _unitOfWork.SaveAsync(cancellationToken);

        return new UpdateExpenseResult
        {
            Data = entity
        };
    }
}
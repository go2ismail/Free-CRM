using Application.Common.Repositories;
using Domain.Entities;
using Domain.Enums;
using FluentValidation;
using MediatR;

namespace Application.Features.BudgetManager.Commands;

public class UpdateBudgetResult
{
    public Budget? Data { get; set; }
}

public class UpdateBudgetRequest : IRequest<UpdateBudgetResult>
{
    public string? Id { get; init; }
    public string? Title { get; init; }
    public string? Description { get; init; }
    public DateTime? BudgetDate { get; init; }
    public string? Status { get; init; }
    public double? Amount { get; init; }
    public string? CampaignId { get; init; }
    public string? UpdatedById { get; init; }
}

public class UpdateBudgetValidator : AbstractValidator<UpdateBudgetRequest>
{
    public UpdateBudgetValidator()
    {
        RuleFor(x => x.Id).NotEmpty();
        RuleFor(x => x.Title).NotEmpty();
        RuleFor(x => x.BudgetDate).NotNull();
        RuleFor(x => x.Amount).NotNull().GreaterThan(0);
        RuleFor(x => x.CampaignId).NotEmpty();
        RuleFor(x => x.Status).NotEmpty();
    }
}

public class UpdateBudgetHandler : IRequestHandler<UpdateBudgetRequest, UpdateBudgetResult>
{
    private readonly ICommandRepository<Budget> _repository;
    private readonly IUnitOfWork _unitOfWork;

    public UpdateBudgetHandler(
        ICommandRepository<Budget> repository,
        IUnitOfWork unitOfWork
        )
    {
        _repository = repository;
        _unitOfWork = unitOfWork;
    }

    public async Task<UpdateBudgetResult> Handle(UpdateBudgetRequest request, CancellationToken cancellationToken)
    {
        var entity = await _repository.GetAsync(request.Id ?? string.Empty, cancellationToken);

        if (entity == null)
        {
            throw new Exception($"Entity not found: {request.Id}");
        }

        entity.UpdatedById = request.UpdatedById;
        entity.Title = request.Title;
        entity.Description = request.Description;
        entity.BudgetDate = request.BudgetDate;
        entity.Status = (BudgetStatus)int.Parse(request.Status!);
        entity.Amount = request.Amount;
        entity.CampaignId = request.CampaignId;

        _repository.Update(entity);
        await _unitOfWork.SaveAsync(cancellationToken);

        return new UpdateBudgetResult
        {
            Data = entity
        };
    }
}
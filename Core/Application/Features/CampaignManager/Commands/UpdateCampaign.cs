using Application.Common.Repositories;
using Domain.Entities;
using Domain.Enums;
using FluentValidation;
using MediatR;

namespace Application.Features.CampaignManager.Commands;

public class UpdateCampaignResult
{
    public Campaign? Data { get; set; }
}

public class UpdateCampaignRequest : IRequest<UpdateCampaignResult>
{
    public string? Id { get; init; }
    public string? Title { get; init; }
    public string? Description { get; init; }
    public double? TargetRevenueAmount { get; init; }
    public DateTime? CampaignDateStart { get; init; }
    public DateTime? CampaignDateFinish { get; init; }
    public string? SalesTeamId { get; init; }
    public string? Status { get; init; }
    public string? UpdatedById { get; init; }
}

public class UpdateCampaignValidator : AbstractValidator<UpdateCampaignRequest>
{
    public UpdateCampaignValidator()
    {
        RuleFor(x => x.Id).NotEmpty();
        RuleFor(x => x.Title).NotEmpty();
        RuleFor(x => x.SalesTeamId).NotEmpty();
        RuleFor(x => x.CampaignDateStart).NotEmpty();
        RuleFor(x => x.CampaignDateFinish).NotEmpty();
        RuleFor(x => x.Status).NotEmpty();
        RuleFor(x => x.TargetRevenueAmount).NotEmpty().GreaterThan(0);
    }
}

public class UpdateCampaignHandler : IRequestHandler<UpdateCampaignRequest, UpdateCampaignResult>
{
    private readonly ICommandRepository<Campaign> _repository;
    private readonly IUnitOfWork _unitOfWork;

    public UpdateCampaignHandler(
        ICommandRepository<Campaign> repository,
        IUnitOfWork unitOfWork
        )
    {
        _repository = repository;
        _unitOfWork = unitOfWork;
    }

    public async Task<UpdateCampaignResult> Handle(UpdateCampaignRequest request, CancellationToken cancellationToken)
    {
        var entity = await _repository.GetAsync(request.Id ?? string.Empty, cancellationToken);

        if (entity == null)
        {
            throw new Exception($"Entity not found: {request.Id}");
        }

        entity.UpdatedById = request.UpdatedById;

        entity.Title = request.Title;
        entity.SalesTeamId = request.SalesTeamId;
        entity.Description = request.Description;
        entity.TargetRevenueAmount = request.TargetRevenueAmount;
        entity.CampaignDateStart = request.CampaignDateStart;
        entity.CampaignDateFinish = request.CampaignDateFinish;
        entity.Status = (CampaignStatus)int.Parse(request.Status!);

        _repository.Update(entity);
        await _unitOfWork.SaveAsync(cancellationToken);

        return new UpdateCampaignResult
        {
            Data = entity
        };
    }
}
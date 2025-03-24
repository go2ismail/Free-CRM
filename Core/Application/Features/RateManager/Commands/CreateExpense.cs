using Application.Common.CQS.Queries;
using Application.Common.Extensions;
using Application.Common.Repositories;
using Application.Features.NumberSequenceManager;
using Domain.Entities;
using Domain.Enums;
using FluentValidation;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Application.Features.RateManager.Commands;

public class CreateRateResult
{
    public Rate? Data { get; set; }
}

public class CreateRateRequest : IRequest<CreateRateResult>
{
    public double? Ratio { get; init; }
    public DateTime? ValidateDate { get; init; }
    public DateTime? ExpiringeDate { get; init; }
}

public class CreateRateValidator : AbstractValidator<CreateRateRequest>
{
    public CreateRateValidator()
    {
        RuleFor(x => x.Ratio).NotNull();
        RuleFor(x => x.ValidateDate).NotNull();
        RuleFor(x => x.ExpiringeDate).NotNull();
    }
}

public class CreateRateHandler : IRequestHandler<CreateRateRequest, CreateRateResult>
{
    private readonly ICommandRepository<Rate> _repository;
    private readonly IUnitOfWork _unitOfWork;
    private readonly NumberSequenceService _numberSequenceService;

    public CreateRateHandler(
        ICommandRepository<Rate> repository,
        IUnitOfWork unitOfWork,
        NumberSequenceService numberSequenceService
    )
    {
        _repository = repository;
        _unitOfWork = unitOfWork;
        _numberSequenceService = numberSequenceService;
    }

    public async Task<CreateRateResult> Handle(CreateRateRequest request, CancellationToken cancellationToken = default)
    {
        var entity = new Rate
        {
            Ratio = request.Ratio,
            ValidateDate = request.ValidateDate,
            ExpiringeDate = request.ExpiringeDate
        };

        await _repository.CreateAsync(entity, cancellationToken);
        await _unitOfWork.SaveAsync(cancellationToken);

        return new CreateRateResult
        {
            Data = entity
        };
    }
    
}
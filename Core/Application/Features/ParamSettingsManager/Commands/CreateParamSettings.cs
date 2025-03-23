using Application.Common.Repositories;
using Domain.Entities;
using FluentValidation;
using MediatR;

namespace Application.Features.ParamSettingsManager.Commands;

public class CreateParamSettingsResult
{
    public ParamSettings? Data { get; set; }
}

public class CreateParamSettingsRequest : IRequest<CreateParamSettingsResult>
{
    public string? ParamName { get; init; }
    public double? ParamValue { get; init; }
    public string? CreatedById { get; init; }
}

public class CreateParamSettingsValidator : AbstractValidator<CreateParamSettingsRequest>
{
    public CreateParamSettingsValidator()
    {
        RuleFor(x => x.ParamName).NotEmpty();
        RuleFor(x => x.ParamValue).NotNull();
    }
}

public class CreateParamSettingsHandler : IRequestHandler<CreateParamSettingsRequest, CreateParamSettingsResult>
{
    private readonly ICommandRepository<ParamSettings> _repository;
    private readonly IUnitOfWork _unitOfWork;

    public CreateParamSettingsHandler(ICommandRepository<ParamSettings> repository, IUnitOfWork unitOfWork)
    {
        _repository = repository;
        _unitOfWork = unitOfWork;
    }

    public async Task<CreateParamSettingsResult> Handle(CreateParamSettingsRequest request, CancellationToken cancellationToken = default)
    {
        var entity = new ParamSettings
        {
            ParamName = request.ParamName,
            ParamValue = request.ParamValue
        };

        await _repository.CreateAsync(entity, cancellationToken);
        await _unitOfWork.SaveAsync(cancellationToken);

        return new CreateParamSettingsResult
        {
            Data = entity
        };
    }
}
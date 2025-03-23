using Application.Common.Repositories;
using Domain.Entities;
using FluentValidation;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Application.Features.ParamSettingsManager.Commands;

public class UpdateParamSettingsByNameResult
{
    public ParamSettings? Data { get; set; }
}

public class UpdateParamSettingsByNameRequest : IRequest<UpdateParamSettingsByNameResult>
{
    public string? ParamName { get; init; }
    public double? NewValue { get; init; }
}

public class UpdateParamSettingsByNameValidator : AbstractValidator<UpdateParamSettingsByNameRequest>
{
    public UpdateParamSettingsByNameValidator()
    {
        RuleFor(x => x.ParamName).NotEmpty();
        RuleFor(x => x.NewValue).NotNull();
    }
}

public class UpdateParamSettingsByNameHandler : IRequestHandler<UpdateParamSettingsByNameRequest, UpdateParamSettingsByNameResult>
{
    private readonly ICommandRepository<ParamSettings> _repository;
    private readonly IUnitOfWork _unitOfWork;

    public UpdateParamSettingsByNameHandler(ICommandRepository<ParamSettings> repository, IUnitOfWork unitOfWork)
    {
        _repository = repository;
        _unitOfWork = unitOfWork;
    }

    public async Task<UpdateParamSettingsByNameResult> Handle(UpdateParamSettingsByNameRequest request, CancellationToken cancellationToken = default)
    {
        var entity = await _repository.GetAsync(request.ParamName ?? string.Empty, cancellationToken);

        if (entity == null)
            throw new KeyNotFoundException($"ParamSettings with name '{request.ParamName}' not found.");

        entity.ParamValue = request.NewValue;

        _repository.Update(entity);
        await _unitOfWork.SaveAsync(cancellationToken);

        return new UpdateParamSettingsByNameResult
        {
            Data = entity
        };
    }
}
using Application.Common.Repositories;
using Domain.Entities;
using FluentValidation;
using MediatR;

namespace Application.Features.ParamSettingsManager.Commands;

public class DeleteParamSettingsByNameResult
{
    public bool Success { get; set; }
}

public class DeleteParamSettingsByNameRequest : IRequest<DeleteParamSettingsByNameResult>
{
    public string? ParamName { get; init; }
}

public class DeleteParamSettingsByNameValidator : AbstractValidator<DeleteParamSettingsByNameRequest>
{
    public DeleteParamSettingsByNameValidator()
    {
        RuleFor(x => x.ParamName).NotEmpty();
    }
}

public class DeleteParamSettingsByNameHandler : IRequestHandler<DeleteParamSettingsByNameRequest, DeleteParamSettingsByNameResult>
{
    private readonly ICommandRepository<ParamSettings> _repository;
    private readonly IUnitOfWork _unitOfWork;

    public DeleteParamSettingsByNameHandler(ICommandRepository<ParamSettings> repository, IUnitOfWork unitOfWork)
    {
        _repository = repository;
        _unitOfWork = unitOfWork;
    }

    public async Task<DeleteParamSettingsByNameResult> Handle(DeleteParamSettingsByNameRequest request, CancellationToken cancellationToken = default)
    {
        var entity = await _repository.GetAsync( request.ParamName ?? string.Empty, cancellationToken);

        if (entity == null)
            return new DeleteParamSettingsByNameResult { Success = false };

        _repository.Delete(entity);
        await _unitOfWork.SaveAsync(cancellationToken);

        return new DeleteParamSettingsByNameResult { Success = true };
    }
}
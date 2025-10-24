using Application.Common.Repositories;
using Domain.Entities;
using FluentValidation;
using MediatR;

namespace Application.Features.ProjectManager.Commands;

public class DeleteProjectResult
{
    public Project? Data { get; set; }
}

public class DeleteProjectRequest : IRequest<DeleteProjectResult>
{
    public string? Id { get; init; }
    public string? DeletedById { get; init; }
}

public class DeleteProjectValidator : AbstractValidator<DeleteProjectRequest>
{
    public DeleteProjectValidator()
    {
        RuleFor(x => x.Id).NotEmpty();
    }
}

public class DeleteProjectHandler : IRequestHandler<DeleteProjectRequest, DeleteProjectResult>
{
    private readonly ICommandRepository<Project> _repository;
    private readonly IUnitOfWork _unitOfWork;

    public DeleteProjectHandler(
        ICommandRepository<Project> repository,
        IUnitOfWork unitOfWork
        )
    {
        _repository = repository;
        _unitOfWork = unitOfWork;
    }

    public async Task<DeleteProjectResult> Handle(DeleteProjectRequest request, CancellationToken cancellationToken)
    {
        var entity = await _repository.GetAsync(request.Id ?? string.Empty, cancellationToken);

        if (entity == null)
        {
            throw new Exception($"Entity not found: {request.Id}");
        }

        entity.UpdatedById = request.DeletedById;

        _repository.Delete(entity);
        await _unitOfWork.SaveAsync(cancellationToken);

        return new DeleteProjectResult
        {
            Data = entity
        };
    }
}

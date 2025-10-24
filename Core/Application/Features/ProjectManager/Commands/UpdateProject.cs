using Application.Common.Repositories;
using Domain.Entities;
using Domain.Enums;
using FluentValidation;
using MediatR;

namespace Application.Features.ProjectManager.Commands;

public class UpdateProjectResult
{
    public Project? Data { get; set; }
}

public class UpdateProjectRequest : IRequest<UpdateProjectResult>
{
    public string? Id { get; init; }
    public string? Title { get; init; }
    public string? Description { get; init; }
    public DateTime? ProjectDateStart { get; init; }
    public DateTime? ProjectDateFinish { get; init; }
    public string? SalesTeamId { get; init; }
    public string? Status { get; init; }
    public string? UpdatedById { get; init; }
}

public class UpdateProjectValidator : AbstractValidator<UpdateProjectRequest>
{
    public UpdateProjectValidator()
    {
        RuleFor(x => x.Id).NotEmpty();
        RuleFor(x => x.Title).NotEmpty();
        RuleFor(x => x.SalesTeamId).NotEmpty();
        RuleFor(x => x.ProjectDateStart).NotEmpty();
        RuleFor(x => x.ProjectDateFinish).NotEmpty();
        RuleFor(x => x.Status).NotEmpty();
    }
}

public class UpdateProjectHandler : IRequestHandler<UpdateProjectRequest, UpdateProjectResult>
{
    private readonly ICommandRepository<Project> _repository;
    private readonly IUnitOfWork _unitOfWork;

    public UpdateProjectHandler(
        ICommandRepository<Project> repository,
        IUnitOfWork unitOfWork
        )
    {
        _repository = repository;
        _unitOfWork = unitOfWork;
    }

    public async Task<UpdateProjectResult> Handle(UpdateProjectRequest request, CancellationToken cancellationToken)
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
        entity.ProjectDateStart = request.ProjectDateStart;
        entity.ProjectDateFinish = request.ProjectDateFinish;
        if (Enum.TryParse<ProjectStatus>(request.Status, out var status))
        {
            entity.Status = status;
        }

        _repository.Update(entity);
        await _unitOfWork.SaveAsync(cancellationToken);

        return new UpdateProjectResult
        {
            Data = entity
        };
    }
}

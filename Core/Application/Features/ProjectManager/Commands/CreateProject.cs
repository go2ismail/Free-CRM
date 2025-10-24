using Application.Common.Repositories;
using Application.Features.NumberSequenceManager;
using Domain.Entities;
using Domain.Enums;
using FluentValidation;
using MediatR;

namespace Application.Features.ProjectManager.Commands;

public class CreateProjectResult
{
    public Project? Data { get; set; }
}

public class CreateProjectRequest : IRequest<CreateProjectResult>
{
    public string? Title { get; init; }
    public string? Description { get; init; }
    public DateTime? ProjectDateStart { get; init; }
    public DateTime? ProjectDateFinish { get; init; }
    public string? SalesTeamId { get; init; }
    public string? Status { get; init; }
    public string? CreatedById { get; init; }
}

public class CreateProjectValidator : AbstractValidator<CreateProjectRequest>
{
    public CreateProjectValidator()
    {
        RuleFor(x => x.Title).NotEmpty();
        RuleFor(x => x.SalesTeamId).NotEmpty();
        RuleFor(x => x.ProjectDateStart).NotEmpty();
        RuleFor(x => x.ProjectDateFinish).NotEmpty();
        RuleFor(x => x.Status).NotEmpty();
    }
}

public class CreateProjectHandler : IRequestHandler<CreateProjectRequest, CreateProjectResult>
{
    private readonly ICommandRepository<Project> _repository;
    private readonly IUnitOfWork _unitOfWork;
    private readonly NumberSequenceService _numberSequenceService;

    public CreateProjectHandler(
        ICommandRepository<Project> repository,
        IUnitOfWork unitOfWork,
        NumberSequenceService numberSequenceService
        )
    {
        _repository = repository;
        _unitOfWork = unitOfWork;
        _numberSequenceService = numberSequenceService;
    }

    public async Task<CreateProjectResult> Handle(CreateProjectRequest request, CancellationToken cancellationToken = default)
    {
        var entity = new Project();
        entity.CreatedById = request.CreatedById;

        entity.Number = _numberSequenceService.GenerateNumber(nameof(Project), "", "PRO");
        entity.Title = request.Title;
        entity.SalesTeamId = request.SalesTeamId;
        entity.Description = request.Description;
        entity.ProjectDateStart = request.ProjectDateStart;
        entity.ProjectDateFinish = request.ProjectDateFinish;
        if (Enum.TryParse<ProjectStatus>(request.Status, out var status))
        {
            entity.Status = status;
        }

        await _repository.CreateAsync(entity, cancellationToken);
        await _unitOfWork.SaveAsync(cancellationToken);

        return new CreateProjectResult
        {
            Data = entity
        };
    }
}

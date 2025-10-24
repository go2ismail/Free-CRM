using Application.Common.Extensions;
using AutoMapper;
using Domain.Enums;
using MediatR;

namespace Application.Features.ProjectManager.Queries;

public record GetProjectStatusListDto
{
    public string? Id { get; init; }
    public string? Name { get; init; }
}

public class GetProjectStatusListProfile : Profile
{
    public GetProjectStatusListProfile()
    {
    }
}

public class GetProjectStatusListResult
{
    public List<GetProjectStatusListDto>? Data { get; init; }
}

public class GetProjectStatusListRequest : IRequest<GetProjectStatusListResult>
{
}

public class GetProjectStatusListHandler : IRequestHandler<GetProjectStatusListRequest, GetProjectStatusListResult>
{
    public GetProjectStatusListHandler()
    {
    }

    public async Task<GetProjectStatusListResult> Handle(GetProjectStatusListRequest request, CancellationToken cancellationToken)
    {
        var statuses = Enum.GetValues(typeof(ProjectStatus))
            .Cast<ProjectStatus>()
            .Select(status => new GetProjectStatusListDto
            {
                Id = ((int)status).ToString(),
                Name = status.ToFriendlyName()
            })
            .ToList();

        await Task.CompletedTask;

        return new GetProjectStatusListResult
        {
            Data = statuses
        };
    }
}

using Application.Common.CQS.Queries;
using Application.Common.Extensions;
using AutoMapper;
using Domain.Entities;
using Domain.Enums;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Application.Features.ProjectManager.Queries;

public record GetProjectListDto
{
    public string? Id { get; init; }
    public string? Number { get; init; }
    public string? Title { get; init; }
    public string? Description { get; init; }
    public DateTime? ProjectDateStart { get; init; }
    public DateTime? ProjectDateFinish { get; init; }
    public ProjectStatus? Status { get; init; }
    public string? StatusName { get; init; }
    public string? SalesTeamId { get; init; }
    public string? SalesTeamName { get; init; }
    public DateTime? CreatedAtUtc { get; init; }
}

public class GetProjectListProfile : Profile
{
    public GetProjectListProfile()
    {
        CreateMap<Project, GetProjectListDto>()
            .ForMember(
                dest => dest.StatusName,
                opt => opt.MapFrom(src => src.Status.HasValue ? src.Status.Value.ToFriendlyName() : string.Empty)
            )
            .ForMember(
                dest => dest.SalesTeamName,
                opt => opt.MapFrom(src => src.SalesTeam != null ? src.SalesTeam.Name : string.Empty)
            );
    }
}

public class GetProjectListResult
{
    public List<GetProjectListDto>? Data { get; init; }
}

public class GetProjectListRequest : IRequest<GetProjectListResult>
{
    public bool IsDeleted { get; init; } = false;
}

public class GetProjectListHandler : IRequestHandler<GetProjectListRequest, GetProjectListResult>
{
    private readonly IMapper _mapper;
    private readonly IQueryContext _context;

    public GetProjectListHandler(IMapper mapper, IQueryContext context)
    {
        _mapper = mapper;
        _context = context;
    }

    public async Task<GetProjectListResult> Handle(GetProjectListRequest request, CancellationToken cancellationToken)
    {
        var query = _context
            .Project
            .AsNoTracking()
            .IsDeletedEqualTo(request.IsDeleted)
            .Include(x => x.SalesTeam)
            .AsQueryable();

        var entities = await query.ToListAsync(cancellationToken);

        var dtos = _mapper.Map<List<GetProjectListDto>>(entities);

        return new GetProjectListResult
        {
            Data = dtos
        };
    }
}

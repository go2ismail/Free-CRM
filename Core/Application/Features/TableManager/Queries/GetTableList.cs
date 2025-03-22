using Application.Common.CQS.Queries;
using Application.Common.Extensions;
using Application.Common.Repositories;
using AutoMapper;
using Domain.Entities;
using Domain.Enums;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Application.Features.TableManager.Queries;

public record GetTableListDto
{
    public string? Name { get; init; }
}
public class GetTableListProfile : Profile
{
    public GetTableListProfile()
    {
        CreateMap<string, GetTableListDto>()
            .ForMember(dest => dest.Name, opt => opt.MapFrom(src => src));
    }
}
public class GetTableListResult
{
    public List<GetTableListDto>? Data { get; init; }
}

public class GetTableListRequest : IRequest<GetTableListResult>
{
}

public class GetTableListHandler : IRequestHandler<GetTableListRequest, GetTableListResult>
{
    private readonly IMapper _mapper;
    private readonly IOrderRepository<List<GetTableListDto>> _repository;

    public GetTableListHandler(IMapper mapper, IOrderRepository<List<GetTableListDto>> repository)
    {
        _mapper = mapper;
        _repository = repository;
    }

    public async Task<GetTableListResult> Handle(GetTableListRequest request, CancellationToken cancellationToken)
    {
        var entities = await _repository.GetTableNamesAsync(cancellationToken);

        var dtos = _mapper.Map<List<GetTableListDto>>(entities);

        return new GetTableListResult
        {
            Data = dtos
        };
    }
}
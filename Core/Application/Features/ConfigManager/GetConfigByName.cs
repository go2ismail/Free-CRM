using Application.Common.Repositories;
using AutoMapper;
using Domain.Entities;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Application.Features.ConfigManager;

public class GetConfigByNameRequest : IRequest<GetConfigByNameResult>
{
    public string Name { get; set; }

    public GetConfigByNameRequest(string name)
    {
        Name = name;
    }
    public GetConfigByNameRequest()
    {
    }

}

public class GetConfigByNameResult
{
    public string? Id { get; set; }
    public string? Name { get; set; }
    public string? Value { get; set; }
    public DateTime? CreatedAtUtc { get; set; }
}

public class GetConfigByNameHandler : IRequestHandler<GetConfigByNameRequest, GetConfigByNameResult>
{
    private readonly ICommandRepository<Config> _configRepository;
    private readonly IMapper _mapper;

    public GetConfigByNameHandler(ICommandRepository<Config> configRepository, IMapper mapper)
    {
        _configRepository = configRepository;
        _mapper = mapper;
    }

    public async Task<GetConfigByNameResult> Handle(GetConfigByNameRequest request, CancellationToken cancellationToken)
    {
        var config = await _configRepository.GetQuery().FirstOrDefaultAsync(c => c.Name == request.Name && !c.IsDeleted, cancellationToken);

        if (config == null)
        {
            return null;
        }

        return _mapper.Map<GetConfigByNameResult>(config);
    }

}

public class ConfigProfile : Profile
{
    public ConfigProfile()
    {
        CreateMap<Config, GetConfigByNameResult>();
    }
}

public class ConfigMethode
{
    private readonly IMediator _mediator;

    public ConfigMethode(IMediator mediator)
    {
        _mediator = mediator;
    }

    public async Task<string?> GetConfigByNameAsync(string name)
    {
        var request = new GetConfigByNameRequest(name);
        var resp= await _mediator.Send(request);
        return resp?.Value;
    }
}



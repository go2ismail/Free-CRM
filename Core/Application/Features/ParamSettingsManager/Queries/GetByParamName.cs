using Application.Common.CQS.Queries;
using AutoMapper;
using Domain.Entities;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Application.Features.ParamSettingsManager.Queries;

public record GetParamSettingsDto
{
    public string? ParamName { get; init; }
    public double? ParamValue { get; init; }
}

public class GetParamSettingsProfile : Profile
{
    public GetParamSettingsProfile()
    {
        CreateMap<ParamSettings, GetParamSettingsDto>();
    }
}

public class GetParamSettingsByNameRequest : IRequest<GetParamSettingsDto?>
{
    public string ParamName { get; init; }
    
    public GetParamSettingsByNameRequest() { }


    public GetParamSettingsByNameRequest(string paramName)
    {
        ParamName = paramName;
    }
}

public class GetParamSettingsByNameHandler : IRequestHandler<GetParamSettingsByNameRequest, GetParamSettingsDto?>
{
    private readonly IMapper _mapper;
    private readonly IQueryContext _context;

    public GetParamSettingsByNameHandler(IMapper mapper, IQueryContext context)
    {
        _mapper = mapper;
        _context = context;
    }

    public async Task<GetParamSettingsDto?> Handle(GetParamSettingsByNameRequest request, CancellationToken cancellationToken)
    {
        var entity = await _context
            .ParamSettings
            .AsNoTracking()
            .FirstOrDefaultAsync(x => x.ParamName == request.ParamName, cancellationToken);

        return _mapper.Map<GetParamSettingsDto?>(entity);
    }
}
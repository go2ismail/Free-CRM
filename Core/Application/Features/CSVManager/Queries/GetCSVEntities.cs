using MediatR;
using System.Collections.Generic;
using Application.Common.Services.CSVManager;
using System.Threading;
using System.Threading.Tasks;
using Application.Features.CSVManager.Queries;



namespace Application.Features.CSVManager.Queries
{
    public class GetCsvEntitiesRequest : IRequest<GetCsvEntitiesResult>
    {
    }
    
    public class GetCsvEntitiesResult
    {
        public List<string> Entities { get; set; } = new();
    }
    
    
    public class GetCsvEntitiesHandler : IRequestHandler<GetCsvEntitiesRequest, GetCsvEntitiesResult>
    {
        private readonly IEntityMetadataService _entityMetadataService;

        public GetCsvEntitiesHandler(IEntityMetadataService entityMetadataService)
        {
            _entityMetadataService = entityMetadataService;
        }

        public Task<GetCsvEntitiesResult> Handle(GetCsvEntitiesRequest request, CancellationToken cancellationToken)
        {
            var entities = _entityMetadataService.GetEntityNames();
            return Task.FromResult(new GetCsvEntitiesResult { Entities = entities });
        }
    }
}
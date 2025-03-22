using System.Collections.Generic;

namespace Application.Common.Services.CSVManager
{
    public interface IEntityMetadataService
    {
        List<string> GetEntityNames();
    }
}
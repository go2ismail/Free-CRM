using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using Application.Common.Services.CSVManager;
using Domain.Common;

namespace Infrastructure.CSVManager
{
    public class EntityMetadataService : IEntityMetadataService
    {
        public List<string> GetEntityNames()
        {
            var baseEntityType = typeof(BaseEntity);

            var entities = Assembly.GetAssembly(typeof(BaseEntity))
                .GetTypes()
                .Where(t => t.IsClass && !t.IsAbstract && typeof(BaseEntity).IsAssignableFrom(t) && t != typeof(BaseEntity))
                .Select(t => t.Name)
                .ToList();
            
            
            entities.Add("UserManager");
            entities.Add("RoleManager");

            return entities;
        }
    }
}
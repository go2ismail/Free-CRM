using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Common.Services.CleanerData
{
    public class CleanupResponseDto
    {
        public bool Success { get; set; }
        public string Message { get; set; }
        public string ErrorMessage { get; set; }
        public int TotalEntitiesRemoved { get; set; }
    }
}

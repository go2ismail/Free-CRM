using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Infrastructure.Utils
{
    public class testCsv
    {
        public DateOnly FromDate { get; set; }
        public DateOnly ToDate { get; set; }
        public string ClientId { get; set; }
        public string SubscriptionId { get; set; }
    }
}
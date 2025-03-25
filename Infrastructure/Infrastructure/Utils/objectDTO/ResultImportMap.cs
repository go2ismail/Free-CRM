using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Infrastructure.Utils.objectDTO
{
    public class ResultImportMap
    {
        public string Campaign_number {  get; set; }
        public string Title { get; set; }
        public string Type { get; set; }
        public DateOnly Date { get; set; }
        public double Amount { get; set; }
    }
}

using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.FileProviders;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Infrastructure.Utils
{
    public class UploadRequest
    {
        public IFormFile fileCamp { get; set; }
        public IFormFile fileRes { get; set; }
        public string separator { get; set; }
        public string dateFormat { get; set; }
    }
}

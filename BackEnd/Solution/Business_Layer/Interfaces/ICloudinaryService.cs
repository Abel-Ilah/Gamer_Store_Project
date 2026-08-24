using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Services.Interfaces
{
    public interface ICloudinaryService
    {
        Task<string> UploadImageAsync(Stream stream, string fileName);
        Task DeleteImageAsync(string publicId);
        public string GetImagePublicId(string imageUrl);
    }
}

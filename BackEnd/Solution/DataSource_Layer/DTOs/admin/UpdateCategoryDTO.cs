using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DataSource.DTOs.admin
{
    public class UpdateCategoryDTO
    {  
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public Stream? ImageFile { get; set; } 
        public string? FileName { get; set; }
        public bool IsFeatured { get; set; } = false;


    }
}

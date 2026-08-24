using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;

namespace DataSource.DTOs.admin
{
    public class AddCategoryDTO_Admin
    {
        public string Name { get; set; } = string.Empty;
        public Stream ImageFile { get; set; } = null!;
        public string FileName { get; set; } = string.Empty;
        public bool IsFeatured { get; set; } = false;

    }
}

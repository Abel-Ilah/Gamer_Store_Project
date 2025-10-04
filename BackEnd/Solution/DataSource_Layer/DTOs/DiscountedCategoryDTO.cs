using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DataSource.DTOs
{
    public class DiscountedCategoryDTO
    {
        public int Id { get; set; }
        public string Name { get; set; } = null!;
        public string imagePath { get; set; } = "";
        public decimal DiscountValue { get; set; }
        public DateOnly StartDate { get; set; }
        public DateOnly EndDate { get; set; }
    }
}

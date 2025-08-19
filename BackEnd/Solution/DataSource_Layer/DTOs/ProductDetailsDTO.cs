using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DataSource.DTOs
{
    public class ProductDetailsDTO
    {
        public int Id { get; set; }

        public string Name { get; set; } = null!;

        public decimal Price { get; set; }

        public DateOnly Date { get; set; }

        public int QuantityInStock { get; set; }

        public decimal DiscountValue { get; set; } = 0!;

        public string? Description { get; set; }

        public string? Details { get; set; }

        public string? About { get; set; }

        public float Rate { get; set; } = 5;

        public List<ProductImageDTO> Images { get; set; } = new List<ProductImageDTO>();
    }
}

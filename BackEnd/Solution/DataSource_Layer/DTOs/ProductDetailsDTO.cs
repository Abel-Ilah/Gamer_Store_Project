using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using DataSource.DTOs.admin;

namespace DataSource.DTOs
{
    public class ProductDetailsDTO
    {
        public int Id { get; set; }

        public string Name { get; set; } = null!;

        public string Category { get; set; } = null!;

        public decimal Price { get; set; }

        public DateOnly Date { get; set; }
         
        public int Quantity { get; set; }

        public decimal Discount { get; set; } = 0!;

        public string Description { get; set; } = null!;

        public double Rating { get; set; }

        public int TotalReviews { get; set; }

        public List<ItemDTO> Details { get; set; } = new List<ItemDTO>();

        public List<ProductImageDTO> Images { get; set; } = new List<ProductImageDTO>();

    }
}

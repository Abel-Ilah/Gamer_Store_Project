using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DataSource.DTOs.admin
{
    public class ProductDetailsDTO_Admin
    {
        public int Id { get; set; }

        public string Name { get; set; } = null!;

        public decimal Price { get; set; }

        public string ImageUrl { get; set; } = null!;

        public DateOnly Date { get; set; }

        public string Category { get; set; } = null!;

        public int Quantity { get; set; }

        public decimal Discount { get; set; } = 0!;

        public string Description { get; set; } = null !;

        public double Rating { get; set; }

        public int TotalReviews { get; set; }

        public List<ItemDTO> Details { get; set; } = new List<ItemDTO>();

        public int Sales { get; set; }
        public decimal Revenue { get; set; }

    }
}

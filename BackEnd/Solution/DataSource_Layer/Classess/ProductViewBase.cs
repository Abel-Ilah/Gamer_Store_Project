using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DataSource.Classess
{
    public class ProductViewBase
    {
        public int Id { get; set; }
        public string Name { get; set; } = null!;
        public decimal Price { get; set; }
        public int QuantityInStock { get; set; }
        public decimal DiscountValue { get; set; }
        public double Rating { get; set; }
        public string ImageUrl { get; set; } = "";
        public int CategoryId { get; set; }

    }
}

using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DataSource.Entities
{
    public class vw_Product
    {
        public int Id { get; set; }
        public string Name { get; set; } = null!;
        public decimal Price { get; set; }
        public int CategoryId { get; set; }
        public DateOnly Date { get; set; }
        public int QuantityInStock { get; set; }
       
        public decimal DiscountValue { get; set; }
        public double Rating { get; set; }
        public string ImageUrl { get; set; } = "";
    }

}

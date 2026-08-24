using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using static DataSource.Repositories.ProductRepository;

namespace DataSource.DTOs.admin
{
   
    public class ProductsFilterDTO_Admin
    {
        public int PageNumber { get; set; } = 1;
        public int PageSize { get; set; } = 20;

        public ProductType ProductType { get; set; } = ProductType.All;

        public string? Search { get; set; }

        public int? CategoryId { get; set; }

        public bool Deleted { get; set; } = false;
    }
}

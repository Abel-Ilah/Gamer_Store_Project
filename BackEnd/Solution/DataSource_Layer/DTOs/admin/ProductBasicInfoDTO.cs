using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DataSource.DTOs.admin
{
    public class ProductBasicInfoDTO
    {
        public int Id { get; set; }
        public string Name { get; set; } = null!;
        public decimal Price { get; set; }
        public int Quantity { get; set; }
        public DateOnly Date { get; set; }
        public int CategoryId { get; set; }
        public string Description { get; set; } = null!;
        public List<ProductImageDTO> Images { get; set; } = new List<ProductImageDTO>();
        public List<ItemDTO> Details { get; set; } = new List<ItemDTO>();

    }
}

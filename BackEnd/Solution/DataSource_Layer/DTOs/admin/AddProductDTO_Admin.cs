using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DataSource.DTOs.admin
{
    public class AddProductDTO_Admin
    {
        public string Name { get; set; } = null!;
        public decimal Price { get; set; }
        public int Quantity { get; set; }
        public int CategoryId { get; set; }
        public string Description { get; set; } = null!;
        public List<ItemDTO>? Details { get; set; } 
        public List<ImageUploadDTO> Images { get; set; } = new();
    }
}

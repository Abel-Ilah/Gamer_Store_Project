using DataSource.DTOs.admin;

namespace APIs.DTOs
{
    public class AddProductRequestDTO
    {
        public string Name { get; set; } = null!;
        public decimal Price { get; set; }
        public int Quantity { get; set; }
        public int CategoryId { get; set; }
        public string Description { get; set; } = null!;
        public List<ItemDTO>? Details { get; set; } 
        public List<ImageFileDTO> Images { get; set; }  = new List<ImageFileDTO>();
    }
}

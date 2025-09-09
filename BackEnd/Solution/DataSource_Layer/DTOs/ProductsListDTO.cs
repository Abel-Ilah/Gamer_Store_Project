

namespace DataSource.DTOs
{
    public class ProductsListDTO
    {
        public List<ProductDTO> Products { get; set; }
        public int TotalProducts { get; set; } = 0;
    }
}



using DataSource.Entities;

namespace DataSource.DTOs
{
    public class ProductsDTO
    {
        public List<vw_Product> Products { get; set; } = new List<vw_Product>();

        public int TotalProducts { get; set; } = 0;
    }
}

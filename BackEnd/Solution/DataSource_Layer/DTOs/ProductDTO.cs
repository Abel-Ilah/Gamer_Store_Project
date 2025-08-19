namespace DataSource.DTOs
{
    public class ProductDTO
    {
        public int Id { get; set; }

        public string Name { get; set; } = null!;

        public decimal Price { get; set; }

        public DateOnly Date { get; set; }

        public int QuantityInStock { get; set; }

        public decimal DiscountValue { get; set; } = 0!;

        public string? ImageUrl { get; set; } 

    }
}

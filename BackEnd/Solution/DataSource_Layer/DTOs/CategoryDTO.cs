using DataSource.Entities;

namespace DataSource.DTOs
{
    public class CategoryDTO
    {
       public int Id { get; set; }
       public string Name { get; set; } = null!;
       public string imagePath { get; set; } = "";
       public bool IsFeatured { get; set; } = false;
    }
    
}

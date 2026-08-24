namespace APIs.DTOs
{
    public class AddCategoryRequestDTO
    {
        public string Name { get; set; } = "";
        public IFormFile? ImageFile { get; set; } 
        public bool IsFeatured { get; set; } = false;
    }
}

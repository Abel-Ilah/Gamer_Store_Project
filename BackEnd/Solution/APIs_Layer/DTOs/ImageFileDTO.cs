namespace APIs.DTOs
{
    public class ImageFileDTO
    {  public int? Id { get; set; }
        public IFormFile? Image {  get; set; }
        public bool IsMain { get; set; }
    }
}

using DataSource.DTOs;
using DataSource.Entities;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Services.services;

namespace APIs.Controllers
{
    [Route("api/categories")]
    [ApiController]
    public class CategoriesController : ControllerBase
    {
        public readonly CategoryService _CategoryService;
        public CategoriesController(CategoryService category)
        {
            _CategoryService = category;
        }

        [HttpGet]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<ActionResult<IEnumerable<CategoryDTO>>> GetAllCategories()
        {
            try
            {
                var Categories = await _CategoryService.GetAllCategoriesAsync();
                var categoriesDTO = Categories.Select(C => new CategoryDTO { Id = C.Id, Name = C.Name, imagePath = C.ImagePath });
                return Ok(categoriesDTO);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }
    }

}

using APIs.DTOs;
using DataSource.DTOs;
using DataSource.DTOs.admin;
using DataSource.Entities;
using DataSource.exceptions;
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


        [HttpPost("add")]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<ActionResult<int>> AddAsync([FromForm] AddCategoryRequestDTO categoryDto)
        {
            if (categoryDto == null) return BadRequest("category object is null");
            if (string.IsNullOrWhiteSpace(categoryDto.Name)) return BadRequest("category name is required");
            if (categoryDto.ImageFile == null) return BadRequest("category image is required");

            Stream imageFile = null!;
            try
            {
              imageFile = categoryDto.ImageFile.OpenReadStream();
              var fileName = categoryDto.ImageFile.FileName;

              var ID =  await  _CategoryService.AddAsync(
                  new AddCategoryDTO_Admin 
                  {
                      Name = categoryDto.Name,
                      ImageFile = imageFile,
                      FileName = fileName,
                      IsFeatured = categoryDto.IsFeatured
                  });
             
              return ID > 0 ? Ok(ID) : StatusCode(500, "something went wrong");
            }
            catch (Exception ex)
            {
                return StatusCode(500, "An unexpected error occurred.");
            }
            finally
            {
                if(imageFile != null) await imageFile.DisposeAsync();
            }
        }


        [HttpPut("update")]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<ActionResult<bool>> UpdateAsync([FromForm] UpdateCategoryRequestDTO categoryDto)
        {
            if (categoryDto == null) return BadRequest("category object is null");
            if (categoryDto.Id <= 0) return BadRequest("category id not valide");
            if (string.IsNullOrWhiteSpace(categoryDto.Name)) return BadRequest("category name is required");

            Stream imageFile = null!;
            string? fileName = null;
            try
            {   
                if(categoryDto.ImageFile != null)
                {
                    imageFile = categoryDto.ImageFile.OpenReadStream();
                    fileName = categoryDto.ImageFile.FileName;
                }
               
                var isUpdated = await _CategoryService.UpdateAsync(new UpdateCategoryDTO 
                { 
                    Id = categoryDto.Id,
                    Name = categoryDto.Name,
                    ImageFile = imageFile,
                    FileName = fileName ,
                    IsFeatured = categoryDto.IsFeatured,
                });

                return isUpdated? Ok(isUpdated) : StatusCode(500, "something went wrong");
            }
            catch (NotFoundException ex)
            {
                return NotFound(ex.Message);
            }
            catch (BadRequestException ex)
            {
                return BadRequest(ex.Message);
            }
            catch (Exception ex)
            {
                return StatusCode(500, "An unexpected error occurred.");
            }
            finally
            {
                if (imageFile != null) await imageFile.DisposeAsync();
            }
        }

        [HttpDelete("delete")]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<ActionResult<bool>> DeleteAsync(int categoryId)
        {
            if (categoryId <= 0) return BadRequest("categoryID not valid");

            try
            {
                var isDeleted = await _CategoryService.DeleteAsync(categoryId);
                return isDeleted ? Ok(isDeleted) : StatusCode(500, "something went wrong");
            }
            catch (NotFoundException ex)
            {
                return NotFound(ex.Message);
            }
            catch (Exception ex)
            {
                return StatusCode(500, "An unexpected error occurred.");
            }
        }

        [HttpGet]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<ActionResult<List<CategoryDTO>>> GetAllCategories()
        {
            try
            {
                var Categories = await _CategoryService.GetAllCategoriesAsync();
                return Ok(Categories);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        [HttpGet("featured")]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<ActionResult<IEnumerable<CategoryDTO>>> GetFeaturedCategories()
        {
            try
            {
                var Categories = await _CategoryService.GetFeaturedCategoriesAsync();
                return Ok(Categories);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }
    }

}

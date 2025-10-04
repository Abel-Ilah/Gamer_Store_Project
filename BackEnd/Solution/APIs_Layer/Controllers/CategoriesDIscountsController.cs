using DataSource.DTOs;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Services.services;

namespace APIs.Controllers
{
    [Route("api/discounted-categories")]
    [ApiController]
    public class CategoriesDIscountsController : ControllerBase
    {
        private readonly CategoriesDiscountsService _cdService;

        public CategoriesDIscountsController(CategoriesDiscountsService cdService)
        {
            _cdService = cdService;
        }

        [HttpGet("discounted-category")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]

        public async Task<ActionResult<DiscountedCategoryDTO?>> getLastDiscoutedCategoryAsync()
        {
            try
            {
                var categoryDTO = await _cdService.getLastDiscoutedCategoryAsync();
                return categoryDTO != null ? Ok(categoryDTO) :NotFound("there is no active discount for any category") ;

            }catch (Exception)
            {
                return StatusCode(500, "internal server error");
            }
        }

    }
}

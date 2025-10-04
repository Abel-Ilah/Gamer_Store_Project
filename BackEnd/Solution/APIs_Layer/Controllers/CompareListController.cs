using DataSource.DTOs;
using DataSource.Entities;
using DataSource.exceptions;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Services.services;

namespace APIs.Controllers
{
    [Route("api/compare")]
    [ApiController]
    public class CompareListController : ControllerBase
    {

        private readonly CompareService _comareService;
        public CompareListController(CompareService comareService)
        {
            _comareService = comareService;
        }

        [HttpPost]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<ActionResult<CompareItemDTO>> AddItemAsync(WishlistItemDTO dto)
        {
            if (dto == null) return BadRequest("compare item is null");
            if (dto.UserId <= 0) return BadRequest("UserId is not valid");
            if (dto.ProductId <= 0) return BadRequest("ProductId is not valid");

            var CompareItem = new CompareItem
            {
                UserId = dto.UserId,
                ProductId = dto.ProductId,
            };
            try
            {
                dto.Id = await _comareService.AddItemAsync(CompareItem);
                return dto.Id > 0 ? Ok(dto) : StatusCode(500, "Something went wrong, the item was not added !");
            }
            catch (AlreadyExitsException ex)
            {
                return BadRequest(ex.Message);
            }
            catch (Exception)
            {
                return StatusCode(500, "iternal server error");
            }
        }

        [HttpPost("AddRange")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<ActionResult> AddCollectionOfItemsAsync(List<CompareItemDTO> items)
        {
            if (items == null || items.Count == 0) return BadRequest("collection of items is empty");

            var newItems = items.Select(item => new CompareItem
            {
                UserId = item.UserId,
                ProductId = item.ProductId,
            }).ToList();

            try
            {
                var isAdded = await _comareService.AddCollectionOfItemsAsync(newItems);
                return isAdded ? Ok("items added successfully") : StatusCode(500, "Something went wrong !");
            }
            catch (Exception)
            {
                return StatusCode(500, "iternal server error");
            }
        }


        [HttpDelete]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<ActionResult<bool>> DeleteItemAsync(int itemId)
        {
            if (itemId <= 0) return BadRequest("itemId is no valid !");
            try
            {
                var isDeleted = await _comareService.DeleteItemAsync(itemId);
                return isDeleted ? Ok(true) : NotFound("no item found");
            }
            catch (Exception)
            {
                return StatusCode(500, "internal server error");
            }
        }


        [HttpGet]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<ActionResult<CompareItemReadDTO>> GetCompareListByUserIdAsync(int userId)
        {
            
            if (userId <= 0) return BadRequest("userId is not valid");

            try
            {
                var CompareList = await _comareService.GetCompareListByUserIdAsync(userId);
                return Ok(CompareList);
            }
            catch (Exception)
            {
                return StatusCode(500, "internal server error");
            }

        }
    }
}

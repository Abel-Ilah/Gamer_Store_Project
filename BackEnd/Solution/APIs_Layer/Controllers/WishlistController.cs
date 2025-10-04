using DataSource.DTOs;
using DataSource.Entities;
using DataSource.exceptions;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Services.services;

namespace APIs.Controllers
{
    [Route("api/wishlist")]
    [ApiController]
    public class WishlistController : ControllerBase
    {
        private readonly WishlistService _wishlistService;
        public WishlistController(WishlistService wishlistService) 
        { 
            _wishlistService = wishlistService;
        }

        [HttpPost]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<ActionResult<WishlistItemDTO>> AddItemAsync(WishlistItemDTO dto)
        {
            if (dto == null) return BadRequest("Wishlist item is null");
            if (dto.UserId <= 0) return BadRequest("UserId is not valid");
            if (dto.ProductId <= 0) return BadRequest("ProductId is not valid");

            var WishlistItem = new WishlistItem
            {
                UserId = dto.UserId,
                ProductId = dto.ProductId,
            };
            try
            {
                dto.Id = await _wishlistService.AddItemAsync(WishlistItem);
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
        public async Task<ActionResult> AddCollectionOfItemsAsync(List<WishlistItemDTO> items)
        {
            if (items == null || items.Count == 0) return BadRequest("collection of items is empty");

            var newItems = items.Select(item => new WishlistItem
            {
                UserId = item.UserId,
                ProductId = item.ProductId,
            }).ToList();

            try
            {
                var isAdded= await _wishlistService.AddCollectionOfItemsAsync(newItems);
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
        public async Task<ActionResult<WishlistItemDTO>> DleteItemAsync(int itemId)
        {
            if (itemId <= 0) return BadRequest("itemId is no valid !");
            try
            {
                var isDeleted = await _wishlistService.DeleteItemAsync(itemId);
                return isDeleted ? Ok(true) : NotFound("no item found");
            }catch(Exception)
            {
                return StatusCode(500, "internal server error");
            }
        }


        [HttpGet]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<ActionResult<WishlistItemDTO>> GetWishlistByUserIdAsync(int userId)
        {
           
            if (userId <= 0) return BadRequest("userId is not valid");

            try
            {
                var wishlist = await _wishlistService.GetWishlistByUserIdAsync(userId);
                return Ok(wishlist);
            }catch(Exception )
            {
                return StatusCode(500, "internal server error");
            }

        }

    }
}

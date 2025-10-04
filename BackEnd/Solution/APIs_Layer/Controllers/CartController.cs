using DataSource.DTOs;
using DataSource.Entities;
using DataSource.exceptions;
using Microsoft.AspNetCore.Mvc;
using Services.services;

namespace APIs.Controllers
{
    [Route("api/cart")]
    [ApiController]
    public class CartController : ControllerBase
    {
        private readonly CartItemService _cartItemService;

        public CartController(CartItemService cartItemService)
        {
            _cartItemService = cartItemService;
        }

        [HttpPost("addCartItem")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<ActionResult<CartItemWriteDTO>>AddCartItemAsync(CartItemWriteDTO cartItemDTO)
        {
           
            if (cartItemDTO == null) return BadRequest("invalid cart item object");
            if (cartItemDTO.userId<=0) return BadRequest("invalid userId");
            if (cartItemDTO.productId <= 0) return BadRequest("invalid productId");

            var cartItem = new CartItem
            {
                UserId = cartItemDTO.userId,
                ProductId = cartItemDTO.productId,
                Quantity = cartItemDTO.Quantity,
            };

            try
            {
                cartItem.Id = await _cartItemService.AddAsync(cartItem);
                return Ok(cartItem);
            }
            catch (AlreadyExitsException ex)
            {
                return BadRequest(ex.Message);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"{ex.Message}");
            }

        }


        [HttpPost("AddRange")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<ActionResult> AddCollectionOfItemsAsync(List<CartItemWriteDTO> items)
        {
            if (items == null || items.Count == 0) return BadRequest("collection of items is empty");

            var newItems = items.Select(item => new CartItem
            {
                UserId = item.userId,
                ProductId = item.productId,
                Quantity = item.Quantity,
            }).ToList();

            try
            {
                var isAdded = await _cartItemService.AddCollectionOfItemsAsync(newItems);
                return isAdded ? Ok("items added successfully") : StatusCode(500, "Something went wrong !");
            }
            catch (Exception)
            {
                return StatusCode(500, "iternal server error");
            }
        }


        [HttpPut("updateCartItem")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<ActionResult<bool>>UpdateItemQuantityAsync(int itemId,int quantity)
        {
            if (itemId <= 0 || quantity <= 0) return BadRequest("invalid data");
            try
            {
                bool isUpdated = await _cartItemService.UpdateItemQuantityAsync(itemId, quantity);
                return Ok(isUpdated);
            }
            catch (Exception ex) { return StatusCode(500, $"{ex.Message}"); }
        }


        [HttpDelete("deleteCartItem")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<ActionResult<bool>> DeleteCartItemAsync(int itemId)
        {
            if (itemId <= 0) return BadRequest("invalid data");
            try
            {
                bool isDeleted = await _cartItemService.DeleteItemAsync(itemId);
                return Ok(isDeleted);
            }
            catch (Exception ex) { return StatusCode(500, $"{ex.Message}"); }
        }


        [HttpGet]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult<IEnumerable<CartItemDTO>>>GetCartByUserIdAsync(int userId)
        {
            
           if(userId<= 0) return BadRequest("invalid userId");

            try
            {
                var cartItems = await _cartItemService.GetCartByUserIdAsync(userId);
                return cartItems;

            }
            catch(Exception ex)
            {
                return StatusCode(500, $"internal server error : {ex.Message}");
            }

        }

        [HttpDelete("clearCart")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult> ClearCartAsync(int userId) {
            if (userId <= 0) return BadRequest("invalid userId");

            try
            {
                var isCleared = await _cartItemService.ClearCartAsync(userId);

                return isCleared ? Ok("Done!") : NotFound("no cart found with the given userId");
            }
            catch(Exception ex)
            {
                return StatusCode(500, $"internal server error : {ex.Message}");
            }
        }


    }
}

using DataSource.DTOs;
using DataSource.Entities;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.VisualBasic;
using Services.services;

namespace APIs.Controllers
{
    [Route("api/order")]
    [ApiController]
    public class OrderController : ControllerBase
    {
        private readonly OrderService _orderService;
        private readonly OrderItemService _orderItemService;
        public OrderController(OrderService orderService, OrderItemService orderItemService)
        {
            _orderService = orderService;
            _orderItemService = orderItemService;
        }

        [HttpPost("NewOrder")]
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<ActionResult<OrderReadDTO>> AddNewOrderAsync(WriteOrderDTO order)
        {
            if (order == null) return BadRequest("invalid data!");

            var newOrder = new Order
            {
                UserId = order.UserId,
                OrderDate = order.OrderDate,
                TotalAmount = order.TotalAmount,
                StatusId = order.StatusId,
                FullName = order.FullName,
                PhoneNumber = order.PhoneNumber,
                Address = order.Address,
                Email = order.Email,
            };
            try
            {
               order.Id = await _orderService.AddOrderAsync(newOrder);
                if(order.Id ==Guid.Empty) return StatusCode(500, "An error occurred while creating the order.");

                List<OrderItem>items = new List<OrderItem>();

                foreach (var orderItem in order.OrderItems)
                {
                    orderItem.OrderId = order.Id;
                    var NewItem = new OrderItem
                    {
                        OrderId = order.Id,
                        ProductId = orderItem.ProductId,
                        Quantity = orderItem.Quantity,
                        UnitPrice = orderItem.UnitPrice,
                        TotalPrice = orderItem.TotalPrice,
                    };
                    items.Add(NewItem);
                }
            
                await  _orderItemService.AddOrderItemsAsync(items);

                return StatusCode(201, order);

            }
            catch (Exception ex)
            {
                return StatusCode(500, $"error : {ex.Message}");
            }
        }

        [HttpGet("GetOrderById")]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<ActionResult<OrderReadDTO>> GetOrderByIdAsync(Guid id)
        {
            if (id == Guid.Empty) return BadRequest("order id is not valid!");

            try
            {
                var order = await _orderService.GetOrderByIdAsync(id);
                if (order == null) return NotFound("order not found!");

                var orderItems = new List<ReadOrderItemDTO>();

                foreach (var item in order.OrderItems)
                {
                    var itemDTO = new ReadOrderItemDTO
                    {
                        Id = item.Id,
                        OrderId = item.OrderId,
                        Quantity = item.Quantity,
                        UnitPrice = item.UnitPrice,
                        TotalPrice = item.TotalPrice,
                        Product = new ShortProductDTO
                        {
                            id = item.Product.Id,
                            name = item.Product.Name,
                            imageUrl = item.Product.ProductImages.Where(image => image.IsMain).Select(pi => pi.ImageUrl).SingleOrDefault()
                        }
                        
                    };
                    orderItems.Add(itemDTO);
                }

                var orderDTO = new OrderReadDTO
                {
                    Id = id,
                    UserId = order.UserId,
                    OrderDate = order.OrderDate,
                    TotalAmount = order.TotalAmount,
                    FullName = order.FullName,
                    Address = order.Address,
                    PhoneNumber = order.PhoneNumber,
                    Email = !string.IsNullOrEmpty(order.Email) ? order.Email : null,
                    OrderItems = orderItems,
                    status = ((OrderService.Status)order.StatusId).ToString()

                };
                    

                return Ok(orderDTO);
            }
            catch(Exception ex)
            {
                return StatusCode(500, $"internal server error : {ex.Message}");
            }

        }

        [HttpGet("ordersHistory")]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<ActionResult<List<OrderReadDTO>>> getAllOrdersAsync(int UserId)
        {
            if (UserId <= 0) return BadRequest("not valid userId");
            try
            {
                
                var orders = await _orderService.getAllOrdersAsync(UserId);
                return Ok(orders);
            }catch(Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }
    }
}

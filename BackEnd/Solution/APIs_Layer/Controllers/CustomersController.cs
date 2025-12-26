using DataSource.DTOs;
using DataSource.Entities;
using Microsoft.AspNetCore.Mvc;
using DataSource.exceptions;
using Services.services;

namespace APIs.Controllers
{
    [Route("api/customers")]
    [ApiController]
    public class CustomersController : ControllerBase 
    {
        private readonly CustomerService _customerService;

        public CustomersController(CustomerService customerService)
        {
            _customerService = customerService;
        }

        [HttpGet("{id}",Name ="find")]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult<IEnumerable<User>>> FindAsync(int id)
        {
            try
            {
                var User = await _customerService.FindAsync(id);
                return User != null ? Ok(User) : NotFound($"User with id [{id}] not found!");
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        [HttpPost("add")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status409Conflict)]
        public async Task<ActionResult<UserReadDTO>>AddCustomerAsync(UserWriteDTO customer)
        {
            try
            {
                 customer.Id =  await _customerService.AddAsync(customer);

                    var createdCustomer = new UserReadDTO
                    {
                        Id = customer.Id,
                        FirstName = customer.FirstName,
                        LastName = customer.LastName,
                        Email = customer.Email,
                        PhoneNumber = customer.PhoneNumber,
                        Address = customer.Address,
                        IsEmailConfirmed = false,
                        CreatedAt = DateTime.Now
                    };

                return Ok(createdCustomer);
            }
            catch(AlreadyExitsException ex)
            {
                return Conflict(new {message =  ex.Message});
            }
            catch (Exception ex)
            {
                return BadRequest($"error : {ex.Message}");
            }
        }


    }
}

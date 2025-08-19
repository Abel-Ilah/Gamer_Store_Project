using DataSource.DTOs;
using DataSource.Entities;
using Microsoft.AspNetCore.Mvc;
using DataSource.exceptions;
using Services.services;

namespace APIs.Controllers
{
    [Route("api/users")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        private readonly UserService _UserService;

        public UsersController(UserService userService)
        {
            _UserService = userService;
        }

        [HttpGet]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<ActionResult<IEnumerable<User>>> GetAllCustomers()
        {
            try
            {
                var Users = await _UserService.GetAllUsersAsync();
                return Ok(Users); 
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }


        [HttpGet("{id}",Name ="GetCustomerById")]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult<IEnumerable<User>>> GetCustomerByIdAsync(int id)
        {
            try
            {
                var User = await _UserService.GetUserByIdAsync(id);
                return User != null ? Ok(User) : NotFound($"User with id [{id}] not found!");
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }


        [HttpGet("GetCurrentUser", Name = "GetCurrentUser")]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult<IEnumerable<UserReadDTO>>> GetCurrentUserAsync(string email,string password)
        {
            try
            {
                var User = await _UserService.GetUserByLoginInfo(email, password);
                if (User == null)
                    return NotFound("Invalid email or password.");

                var userDTO = new UserReadDTO()
                {
                    Id = User.Id,
                    FirstName = User.FirstName,
                    LastName = User.LastName,
                    Email = User.Email,
                    Address = User.Address,
                    PhoneNumber = User.PhoneNumber,
                    IsEmailConfirmed = User.IsEmailConfirmed,
                };
                return Ok(userDTO);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        [HttpPost("AddNewUser")]
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status409Conflict)]
        public async Task<ActionResult<User>>AddCustomer(UserWriteDTO newCustomer)
        {
            User customer  = new User
            {
                FirstName = newCustomer.FirstName,
                LastName = newCustomer.LastName,
                Email = newCustomer.Email,
                Password = newCustomer.Password,
                PhoneNumber = newCustomer.PhoneNumber,
                Address = newCustomer.Address,
               
            };

            try
            {
                 newCustomer.Id =  await _UserService.AddUserAsync(customer);
                return CreatedAtRoute("GetCustomerById", new { id = newCustomer.Id }, newCustomer);
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

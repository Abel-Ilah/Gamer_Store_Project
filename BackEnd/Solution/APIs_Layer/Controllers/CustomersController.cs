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
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
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
                return StatusCode(500, $"error : {ex.Message}");
            }
        }

        [HttpDelete("delete")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<ActionResult> DeleteCustomerAsync(int id)
        {
            if(id <= 0) return BadRequest("Invalid customer id.");
            try
            {
                await _customerService.DeleteAsync(id);
                return Ok($"Customer deleted successfully.");
            }
            catch (NotFoundException ex)
            {
                return NotFound(ex.Message);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }


        [HttpPut("update-personal-info")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<ActionResult> UpdatePerosonalInfoAsync(PersonalInfoDTO info)
        {
            if (info == null) return BadRequest("object is empty");
            if (info.Id <= 0) return BadRequest("Invalid UserId.");
            if (string.IsNullOrEmpty(info.FirstName)) return BadRequest("FirstName is required");
            if (string.IsNullOrEmpty(info.LastName)) return BadRequest("LastName is required");

            try
            {
               bool IsUpdated =  await _customerService.UpdatePersonalInfo(info);
                return IsUpdated? Ok("Info Updated successfully."): StatusCode(500, "something went wrong");
            }
            catch (NotFoundException ex)
            {
                return NotFound(ex.Message);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }



        [HttpPut("change-password")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<ActionResult> ChangePasswordAsync(NewPsswordDTO obj)
        {
            if (obj == null) return BadRequest("Invalid request data.");
            if (obj.UserId <= 0) return BadRequest("Invalid UserId");
            if (string.IsNullOrEmpty(obj.CurrentPassword)) return BadRequest("Current password is required");
            if (string.IsNullOrEmpty(obj.NewPassword)) return BadRequest("New password is required");
            if (obj.CurrentPassword == obj.NewPassword) return BadRequest("The new password must be different from the current password");
            if (obj.NewPassword.Length <= 6) return BadRequest("The new password must be longer than 6 characters.");

            try
            {
                bool isChanged = await _customerService.ChangePasswordAsync(obj);
                return isChanged ? Ok() : StatusCode(500, "something went wrong");
            }
            catch (NotFoundException ex)
            {
                return NotFound(ex.Message);
            } 
            catch (BadRequestException ex)
            {
                return BadRequest(ex.Message);
            } catch (Exception ex)
            {
                return StatusCode(500,ex.Message);
            }
           
        }

    }
}

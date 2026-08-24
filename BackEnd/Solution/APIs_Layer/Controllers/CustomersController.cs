using DataSource.DTOs;
using DataSource.Entities;
using Microsoft.AspNetCore.Mvc;
using DataSource.exceptions;
using Services.services;
using DataSource.DTOs.admin;

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

        [HttpGet]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<ActionResult<List<CustomerBasicDto_Admin>>> GetCustomersAsync(int pageNumber,int pageSize)
        {
            if (pageNumber <= 0) return BadRequest("page number not valide");
            if (pageSize <= 0) return BadRequest("page size not valide");
            try
            {
                var customersList = await _customerService.GetCustomersAsync(pageNumber, pageSize);
                return Ok(customersList);

            }catch(Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }

        [HttpPost("add/me")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status409Conflict)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<ActionResult<DataSource.DTOs.CustomerInfoDTO>>AddCustomerAsync(AddCustomerDTO customer)
        {
            try
            {
                 customer.Id =  await _customerService.AddAsync(customer);

                    var createdCustomer = new DataSource.DTOs.CustomerInfoDTO
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
                return Conflict(ex.Message);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"error : {ex.Message}");
            }
        }

        [HttpDelete("delete/me")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<ActionResult> DeleteMeAsync(int id)
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


        [HttpPut("update-my-info")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<ActionResult> UpdatePerosonalInfoAsync(CustomerPersonalInfoDTO info)
        {
            if (info == null) return BadRequest("object is empty");
            if (info.Id <= 0) return BadRequest("Invalid UserId.");
            if (string.IsNullOrEmpty(info.FirstName)) return BadRequest("FirstName is required");
            if (string.IsNullOrEmpty(info.LastName)) return BadRequest("LastName is required");

            try
            {
               bool IsUpdated =  await _customerService.UpdateAsync(info);
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


        [HttpPut("change-my-password")]
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

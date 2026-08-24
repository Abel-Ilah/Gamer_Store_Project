using APIs.DTOs;
using DataSource.DTOs;
using DataSource.DTOs.admin;
using DataSource.exceptions;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Services.services;

namespace APIs.Controllers.admin
{
    [Route("api/admin/customers")]
    [ApiController]
    public class AdminCustomerController : ControllerBase
    {
        private readonly CustomerService _customerService;
        public AdminCustomerController(CustomerService customerService) 
        {
            _customerService = customerService;
        }

        [HttpGet("filter")]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<ActionResult<FilteredCustomersDTO_Admin>> FilterCustomersAsync([FromQuery] CustomersFilterDTO_Admin filter)
        {
            if (filter.PageNumber <= 0) return BadRequest("page number not valide");
            if (filter.PageSize <= 0) return BadRequest("page size not valide");
            if (filter.Search != null && filter.Search.Trim().Length < 3) return BadRequest("the search text is very short");
            try
            {
                var filteredCustomers = await _customerService.FilterCustomersAsync(filter);
                return Ok(filteredCustomers);

            }
            catch (Exception ex)
            {
                return StatusCode(500, "internal server error.");
            }
        }

        [HttpDelete("{customerId:int}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<ActionResult> DeleteCustomerAsync(int customerId)
        {
            if (customerId <= 0) return BadRequest("Invalid customer id.");
            try
            {
                await _customerService.DeleteAsync(customerId);
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

        [HttpPut("{customerId:int}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<ActionResult> RestoreCustomerAsync(int customerId)
        {
            if (customerId <= 0) return BadRequest("Invalid customer id.");
            try
            {
                await _customerService.RestoreAsync(customerId);
                return Ok($"Customer restored successfully.");
            }
            catch (NotFoundException ex)
            {
                return NotFound(ex.Message);
            }
            catch (Exception ex)
            {
                return StatusCode(500, "internal server error");
            }
        }

    }
}

using DataSource.DTOs.admin;
using Microsoft.AspNetCore.Mvc;
using Services.services;

namespace YourProject.Controllers.Admin
{
    [ApiController]
    [Route("api/admin/dashboard")]
    public class DashboardController : ControllerBase
    {
        private readonly DashboardService _dashboardService;

        public DashboardController(DashboardService dashboardService)
        {
            _dashboardService = dashboardService;
        }

        [HttpGet]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<ActionResult<DashboardDataDTO>> GetDashboardDataAsync()
        {
            try
            {
                var dashboardData = await _dashboardService.GetDashboardDataAsync();

                return Ok(dashboardData);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }
    }
}
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Services.services;

namespace APIs.Controllers.admin
{
    [Route("api/admins")]
    [ApiController]
    public class AdminController : ControllerBase
    {
        private readonly AdminService _adminService;

        public AdminController(AdminService adminService)
        {
            _adminService = adminService;
        }
    }
}

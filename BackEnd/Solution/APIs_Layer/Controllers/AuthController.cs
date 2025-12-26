using DataSource.DTOs;
using DataSource.Entities;
using DataSource.exceptions;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Protocols.OpenIdConnect;
using Services.classes;
using Services.services;

namespace APIs.Controllers
{
    [Route("api/auth")]
    [ApiController]
    public class AuthController : ControllerBase
    {
     
        
        private readonly AuthService _authService;

        public AuthController(AuthService authService)
        {
            _authService = authService;
        }

        [HttpPost("login", Name = "login")]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult<UserReadDTO>>Login([FromBody] LoginRequestDTO credentials)
        {
            if (credentials == null) return BadRequest("login request object is null");
            if (string.IsNullOrEmpty(credentials.Email)) return BadRequest("email is required");
            if (string.IsNullOrEmpty(credentials.Password) ) return BadRequest("password is required");
            if (string.IsNullOrEmpty(credentials.Role) || (credentials.Role.ToLower().Trim() != "admin" && credentials.Role.ToLower().Trim() != "customer"))
                return BadRequest("user role is not valid");

            try
            {
                var user = await _authService.Login(credentials);
                return user == null ? BadRequest("Invalid email or password") : Ok(user);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

       


       


    }

}

using DataSource.DTOs;
using DataSource.Entities;
using DataSource.exceptions;
using Microsoft.AspNetCore.Mvc;
using Services.classes;
using Services.services;

namespace APIs.Controllers
{
    [Route("api/auth")]
    [ApiController]
    public class AuthController : ControllerBase
    {
     
        private readonly EmailConfirmationCodeService _confirmationCodeService;

        public AuthController(EmailConfirmationCodeService emailConfirmationCodeService)
        {
            _confirmationCodeService = emailConfirmationCodeService;
        }

        [HttpPost("send-confirmation")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<ActionResult<EmailConfirmationDTO>> SendConfirmationEmail(int userId)
        {
            try
            {
                int emailConfirmationRecordId = await _confirmationCodeService.AddAsync(userId);
                EmailConfirmationCode? emailConfirmation = await _confirmationCodeService.GetByIdAsync(emailConfirmationRecordId);
                if (emailConfirmation == null)
                { 
                    return NotFound("fialed to add new confirmaiton code to database!");
                }
                return Ok(new EmailConfirmationDTO()
                {
                    Id = emailConfirmation.Id,
                    UserId = emailConfirmation.UserId,
                    CreatedAt = emailConfirmation.CreatedAt,
                    ExpiresAt = emailConfirmation.ExpiresAt,
                    IsUsed = emailConfirmation.IsUsed,
                    Code = emailConfirmation.Code,
                });
            
            }
            catch (Exception ex) 
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
         
        }

        [HttpPut("verify-email")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<ActionResult<bool>> VerifyEamilAsync(int userId,string verificationCode)
        {
            if (userId <= 0) return BadRequest("Invalid user ID.");
            if (string.IsNullOrEmpty(verificationCode)) return BadRequest("Verification code is required.");
            try
            {
                bool isEmailConfirmed = await _confirmationCodeService.VerifyEmailAsync(userId,verificationCode);
                return isEmailConfirmed ? Ok("Email has been confirmed successfully.") : BadRequest("invalid verification code");
            }
            catch (ObjectNotFoundException ex) 
            { 
                return NotFound(new {message = ex.Message });
            }
            catch (VerificationCodeException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
            catch(Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }
    

    }

}

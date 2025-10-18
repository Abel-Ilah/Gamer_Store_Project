using DataSource.DTOs;
using DataSource.Entities;
using DataSource.exceptions;
using Microsoft.AspNetCore.Mvc;
using Services.classes;
using Services.services;
using static Services.services.EmailVerificationCodeService;

namespace APIs.Controllers
{
    [Route("api/auth")]
    [ApiController]
    public class AuthController : ControllerBase
    {
     
        private readonly EmailVerificationCodeService _emailVerificationCodeService;
        private readonly PasswordResetTokenService _resetTokenService;

        public AuthController(EmailVerificationCodeService verificationCodeService, PasswordResetTokenService resetTokenService)
        {
            _emailVerificationCodeService = verificationCodeService;
            _resetTokenService = resetTokenService;
        }

        [HttpPost("send-verification")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<ActionResult<EmailConfirmationDTO>> SendEmailVerificationCodeAsync(string email)
        {
            if (string.IsNullOrEmpty(email)) return BadRequest("invalid email");
            try
            {
                int VerificationCodeId = await _emailVerificationCodeService.AddAsync(email);

                return VerificationCodeId > 0 ? Ok(VerificationCodeId) : StatusCode(500, "something went wrong");
            
            }
            catch (Exception ex) 
            {
                return StatusCode(500, $"{ex.Message}");
            }
         
        }

        [HttpPut("verify-email")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<ActionResult<bool>> VerifyConfirmEmailCodeAsync(VerificationDTO dto)
        {
            if (dto == null) return BadRequest("verification object is null");
            if (string.IsNullOrEmpty(dto.Email)) return BadRequest("email is empty");
            if (string.IsNullOrEmpty(dto.Code)) return BadRequest("verification code is empty");

            try
            {
                bool isEmailConfirmed = await _emailVerificationCodeService.VerifyEmailAsync(dto);
                return isEmailConfirmed ? Ok("Email has been verified successfully.") : BadRequest("something went wrong");
            }
            catch (ObjectNotFoundException ex) 
            { 
                return NotFound(ex.Message );
            }
            catch (VerificationCodeException ex)
            {
                return BadRequest(ex.Message );
            }
            catch(Exception ex)
            {
                return StatusCode(500, $"{ex.Message}");
            }
        }


        [HttpPost("send-reset-token")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<ActionResult<EmailConfirmationDTO>> SendPasswordResetTokenAsync(string email)
        {
            if (string.IsNullOrEmpty(email)) return BadRequest("invalid email");
            try
            {
                int tokenId = await _resetTokenService.AddNewTokenAsync(email);

                return tokenId > 0 ? Ok(tokenId) : StatusCode(500, "something went wrong");

            }
            catch (Exception ex)
            {
                return StatusCode(500, $"{ex.Message}");
            }

        }


        [HttpPut("new-password")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]

        public async Task<ActionResult<bool>> CreateNewPasswordAsync(string newPassword,string token)
        {
            
            if (string.IsNullOrEmpty(newPassword)) return BadRequest("password is empty");
            if (string.IsNullOrEmpty(token)) return BadRequest("reset token is empty");

            try
            {
                bool isPasswordChanged = await _resetTokenService.CreateNewPasswordAsync(newPassword,token);
                return isPasswordChanged ? Ok("password has been changed") : BadRequest("something went wrong");
            }
            catch (BadRequestException ex)
            {
                return BadRequest(ex.Message);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"{ex.Message}");
            }
        }


    }

}

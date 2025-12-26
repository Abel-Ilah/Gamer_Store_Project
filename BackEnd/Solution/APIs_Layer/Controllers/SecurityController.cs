using DataSource.DTOs;
using DataSource.exceptions;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Services.classes;
using Services.services;

namespace APIs.Controllers
{
    [Route("api/security")]
    [ApiController]
    public class SecurityController : ControllerBase
    {
        private readonly EmailVerificationService _emailVerificationService;
        private readonly ResetPasswordService _resetPasswordService;

        public SecurityController(EmailVerificationService emailVerificationService, ResetPasswordService resetPasswordService)
        {
            _emailVerificationService = emailVerificationService;
            _resetPasswordService = resetPasswordService;
        }

        [HttpPost("email-verification-request")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<ActionResult<int>> CreateEmailVerificationAsync(int userId,string email)
        {
            if (string.IsNullOrEmpty(email)) return BadRequest("invalid email");
            if(!Validations.IsValidEmailFormat(email)) return BadRequest("invalid email format");
            try
            {
                int VerificationCodeId = await _emailVerificationService.AddAsync(userId,email);

                return VerificationCodeId > 0 ? Ok(VerificationCodeId) : StatusCode(500, "something went wrong");

            }
            catch (BadRequestException ex)
            {
                return BadRequest(ex.Message);
            }   
            catch (NotFoundException ex)
            {
                return NotFound(ex.Message);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"{ex.Message}");
            }

        }

        [HttpPut("verify-email")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<ActionResult> VerifyEmailAsync(int userId,string code)
        {
           
            if (userId <= 0)return BadRequest("invalid userId.");
            if (string.IsNullOrEmpty(code)) return BadRequest("verification code is empty");

            try
            {
                bool isEmailConfirmed = await _emailVerificationService.VerifyAsync(userId,code);
                return isEmailConfirmed ? Ok("Email has been verified successfully.") : BadRequest("something went wrong");
            }
            catch (NotFoundException ex)
            {
                return NotFound(ex.Message);
            }
            catch (VerificationCodeException ex)
            {
                return BadRequest(ex.Message);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"{ex.Message}");
            }
        }

        [HttpPost("reset-password-request")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<ActionResult<string>> SendResetPasswordTokenAsync(string email,string role)
        {
            if (string.IsNullOrEmpty(email)) return BadRequest("invalid email");
            try
            {
                bool isSent = await _resetPasswordService.AddRequestAsync(email,role);

                return isSent? Ok("Reset Password Token sent to your email") : StatusCode(500, "something went wrong");

            }
            catch(NotFoundException ex)
            {
                return NotFound(ex.Message);
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

        [HttpPut("set-new-password")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<ActionResult<bool>> SetNewPasswordAsync(string newPassword, string token)
        {

            if (string.IsNullOrEmpty(newPassword)) return BadRequest("password is empty");
            if (string.IsNullOrEmpty(token)) return BadRequest("reset token is empty");

            try
            {
                bool isPasswordChanged = await _resetPasswordService.SetNewPasswordAsync(newPassword, token);
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

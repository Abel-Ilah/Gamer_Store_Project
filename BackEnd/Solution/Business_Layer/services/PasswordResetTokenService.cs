using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;
using DataSource.Entities;
using DataSource.Repositories;

namespace Services.services
{
    public class PasswordResetTokenService
    {
        private readonly PasswordResetTokenRepository _passwordResetTokenRepository;
        private readonly EmailService _EmailService;
        private readonly UserService _UserService;
        public PasswordResetTokenService(PasswordResetTokenRepository passwordResetTokenRepository, EmailService emailService, UserService userService)
        {
            _passwordResetTokenRepository = passwordResetTokenRepository;
            _EmailService = emailService;
            _UserService = userService;

        }

        private string GenerateSecureToken(int length = 32)
        {
            var randomBytes = RandomNumberGenerator.GetBytes(length);
            return Convert.ToBase64String(randomBytes)
                          .Replace("+", "-")
                          .Replace("/", "_")
                          .Replace("=", ""); 
        }
        public async Task<int> AddNewTokenAsync(string email)
        {
            var userId = await _UserService.GetUserId(email);
            if (userId == 0)
                throw new Exception("Email not found.");

            string token = GenerateSecureToken();
            var createdAt = DateTime.Now;
            var expiresAt = createdAt.AddMinutes(60);

          
            var tokenObject = new PasswordResetToken
            {
                UserId = userId,
                Token = token,
                CreatedAt = createdAt,
                ExpiresAt = expiresAt,
                IsUsed = false
            };

            int tokenId = await _passwordResetTokenRepository.AddNewTokenAsync(tokenObject);

            if (tokenId > 0)
            {
                var subject = "Reset Your Password";

                var resetLink = $"http://localhost:3000/account/password/reset/{token}";

                var body = $@"
        <div style=""font-family: Arial, sans-serif; background-color: #f9f9f9; 
                    padding: 20px; border-radius: 10px; max-width: 500px; 
                    margin: auto; text-align: center;"">
            <h2 style=""color: #333;"">Password Reset Request</h2>

            <p style=""font-size: 16px; color: #555;"">
                We received a request to reset your password. Please click the link below to continue:
            </p>

            <a href=""{resetLink}"" 
               style=""display:inline-block; background-color:#007bff; color:#fff; 
                      padding:10px 20px; border-radius:6px; text-decoration:none; 
                      font-size:16px; margin-top:10px;"">
                Reset Password
            </a>

            <p style=""font-size: 14px; color: #777; margin-top: 20px;"">
                This link will expire in 60 minutes. If you did not request this, please ignore this email.
            </p>
        </div>";

                await _EmailService.SendAsync(email, subject, body);
            }

            return tokenId;
        }

        public async Task<bool> CreateNewPasswordAsync(string password, string token)
        {
            return await _passwordResetTokenRepository.CreateNewPasswordAsync(password, token);
        }

    }
}

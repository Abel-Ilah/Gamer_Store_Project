using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Services.classes;
using Services.Interfaces;

namespace Services.services
{
    public class ResetPasswordTokenSender : IEmailListener
    {
        private readonly IEmailService _emailService;

        public ResetPasswordTokenSender(IEmailService emailService)
        {
            _emailService = emailService;
        }

        public async Task HandleAsync(EmailEvent data)
        {

            var subject = "Reset Your Password";
            
            var resetLink = $"http://localhost:3000/account/password/reset/{data.Payload}";
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

            await _emailService.SendAsync(data.Email, subject, body);
        }
    }
}

using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection.Metadata.Ecma335;
using System.Text;
using System.Threading.Tasks;
using DataSource.Entities;
using DataSource.Repositories;
using Services.classes;

namespace Services.services
{
    public class EmailConfirmationCodeService
    {
        private readonly EmailConfirmationRepository _EmailConfirmationRepository;
        private readonly EmailService _EmailService;
        private readonly UserService _UserService;
        public EmailConfirmationCodeService(EmailConfirmationRepository emailConfirmationRepository,EmailService emailService,UserService userService) 
        {
            _EmailConfirmationRepository = emailConfirmationRepository;
            _EmailService = emailService;
            _UserService = userService;

        }

        public async Task<int>AddAsync(int userId) 
        {
          var user = await _UserService.GetUserByIdAsync(userId);
          if(user == null) return 0;
          
            var random = new Random();
            int confirmationCode = random.Next(100000, 1000000);
            var createdAt = DateTime.Now;
            var expiresAt = createdAt.AddMinutes(15);
            EmailConfirmationCode emailConfirmationObject = new EmailConfirmationCode()
            {
                UserId = userId,
                CreatedAt = createdAt,
                ExpiresAt = expiresAt,
                IsUsed = false,
                Code = confirmationCode.ToString(),

            };
         int emailConfirmationId =   await _EmailConfirmationRepository.AddAsync(emailConfirmationObject);

         if(emailConfirmationId> 0)
         {
                var subject = "Your Email Confirmation Code";
                var body = $@"
                <div style=""font-family: Arial, sans-serif; background-color: #f9f9f9; padding: 20px; border-radius: 10px; max-width: 400px; margin: auto; text-align: center;"">
                <h2 style=""color: #333;"">Email Confirmation</h2>
                <p style=""font-size: 16px; color: #555;"">Your confirmation code is:</p>
                <div style=""font-size: 28px; font-weight: bold; color: #e74c3c; margin: 10px 0;"">
                {confirmationCode}
                </div>
                <p style=""font-size: 14px; color: #999;"">This code is valid for 15 minutes.</p>
                </div>";
                await _EmailService.SendAsync(user.Email, subject, body);
         }
         return emailConfirmationId;
        }

        public async Task<EmailConfirmationCode?>GetByIdAsync(int id)
        {
            return await _EmailConfirmationRepository.GetByIdAsync(id);
        }

        public async Task<bool> VerifyEmailAsync(int userId, string verificationCode)
        {
            return await _EmailConfirmationRepository.VerifyEmailAsync(userId, verificationCode);
        }
   

    }

}

using DataSource.DTOs;
using DataSource.Entities;
using DataSource.Repositories;


namespace Services.services
{
    public class EmailVerificationCodeService
    {
        private readonly EmailVerificationRepository _emailVerificationRepository;
        private readonly EmailService _EmailService;
        private readonly UserService _UserService;
        public EmailVerificationCodeService(EmailVerificationRepository emailVerificationRepository,EmailService emailService,UserService userService) 
        {
            _emailVerificationRepository = emailVerificationRepository;
            _EmailService = emailService;
            _UserService = userService;

        }

        public async Task<int>AddAsync(string email) 
        {
            var userId = await _UserService.GetUserId(email);
            
            if (userId == 0) throw new Exception("email not exists");
          
            var random = new Random();
            int confirmationCode = random.Next(100000, 1000000);
            var createdAt = DateTime.Now;
            var expiresAt = createdAt.AddMinutes(15);
            VerificationCode emailConfirmationObject = new VerificationCode()
            {
                UserId = userId,
                CreatedAt = createdAt,
                ExpiresAt = expiresAt,
                IsUsed = false,
                Code = confirmationCode.ToString(),
            };
         int VerificationCodeId =   await _emailVerificationRepository.AddAsync(emailConfirmationObject);

         if(VerificationCodeId> 0)
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
                await _EmailService.SendAsync(email, subject, body);
         }
         return VerificationCodeId;
        }

       public async Task<bool> VerifyEmailAsync(VerificationDTO verificationDTO)
       {
           return await _emailVerificationRepository.VerifyEmailAsync(verificationDTO);
       }

     
    }

}

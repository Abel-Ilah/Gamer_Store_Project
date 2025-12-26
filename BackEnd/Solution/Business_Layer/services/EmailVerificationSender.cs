
using Services.classes;
using Services.Interfaces;

namespace Services.services
{


    public class EmailVerificationSender : IEmailListener
    {
        private readonly IEmailService _emailService;
        
        public EmailVerificationSender(IEmailService emailService)
        {
            _emailService = emailService;
        }

        public async Task HandleAsync(EmailEvent data)
        {

            var subject = "Your Email Confirmation Code";
            var body = $@"
                <div style=""font-family: Arial, sans-serif; background-color: #f9f9f9; padding: 20px; border-radius: 10px; max-width: 400px; margin: auto; text-align: center;"">
                <h2 style=""color: #333;"">Email Confirmation</h2>
                <p style=""font-size: 16px; color: #555;"">Your confirmation code is:</p>
                <div style=""font-size: 28px; font-weight: bold; color: #e74c3c; margin: 10px 0;"">
                {data.Payload}
                </div>
                <p style=""font-size: 14px; color: #999;"">This code is valid for 15 minutes.</p>
                </div>";
            await _emailService.SendAsync(data.Email, subject, body);
        }

    } 
    
}

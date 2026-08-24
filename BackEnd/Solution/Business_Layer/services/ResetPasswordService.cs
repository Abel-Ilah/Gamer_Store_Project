using System.Security.Cryptography;
using DataSource.Repositories;
using Microsoft.Extensions.DependencyInjection;
using Services.classes;
using Services.Interfaces;

namespace Services.services
{
    public class ResetPasswordService
    {
        private readonly ResetPasswordRepository _resetPasswordRepository;
        private readonly IEmailNotifier _resetPasswordNotifier;
        public ResetPasswordService(ResetPasswordRepository resetPasswordRepository, [FromKeyedServices("reset-password-notifier")]IEmailNotifier resetPasswordNotifier) 
        { 
            _resetPasswordRepository = resetPasswordRepository;
            _resetPasswordNotifier = resetPasswordNotifier;
        }

 
        public async Task<bool> AddRequestAsync(string email )
        {
            
            var Request = await _resetPasswordRepository.AddRequestAsync(email);
            
            if (Request.Id > 0)
            {
                await _resetPasswordNotifier.NotifyAsync(
                                                  new EmailEvent
                                                  {
                                                      Email = email,
                                                      Payload = Request.Token
                                                  }
                                                  ); 
            }

            return Request.Id > 0;
        }

        public async Task<bool> SetNewPasswordAsync(string password, string token)
        {
            return await _resetPasswordRepository.SetNewPasswordAsync(password, token);
        }

    }
}

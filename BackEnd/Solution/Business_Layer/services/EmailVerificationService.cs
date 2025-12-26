using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using DataSource.DTOs;
using DataSource.Entities;
using DataSource.Repositories;
using Microsoft.Extensions.DependencyInjection;
using Services.classes;
using Services.Interfaces;

namespace Services.services
{
    public class EmailVerificationService
    {
        private readonly EmailVerificationRepository _emailVerificationRepository;
        private readonly IEmailNotifier _notifier;

        public EmailVerificationService(EmailVerificationRepository emailVerificationRepository, [FromKeyedServices("verify-email-notifier")]IEmailNotifier notifier)
        {
            _emailVerificationRepository = emailVerificationRepository;
            _notifier = notifier;
        }

        public async Task<int> AddAsync(int userId,string email)
        {

            var verification = GenerateEmailVerificationObject(userId);

            int verificationId = await _emailVerificationRepository.AddAsync(verification);

            if (verificationId > 0)
            {
                await _notifier.NotifyAsync(new EmailEvent
                {
                    Email = email,
                    Payload = verification.Code
                });
            }
            return verificationId;
        }
         
        public async Task<bool> VerifyAsync(int userId, string code)
        {
            return await _emailVerificationRepository.VerifyAsync(userId,code);
        }

        // ===== Helpers =====
        private EmailVerification GenerateEmailVerificationObject(int userId)
        {
            var random = new Random();
            var createdAt = DateTime.Now;

            return new EmailVerification
            {
                UserId = userId,
                Code = random.Next(100000, 1000000).ToString(),
                CreatedAt = createdAt,
                ExpiresAt = createdAt.AddMinutes(15),
                IsUsed = false
            };
        }

    }
}

using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using DataSource.Data;
using DataSource.Entities;
using DataSource.exceptions;
using Microsoft.EntityFrameworkCore;

namespace DataSource.Repositories
{
    public class EmailConfirmationRepository
    {
       private readonly AppDbContext _context;

        public EmailConfirmationRepository (AppDbContext context)
        {
            _context = context;
        }
    
        public async Task<int>AddAsync(EmailConfirmationCode emailConfirmationCode)
        {
            var activeConfirmationCodes = await _context.EmailConfirmationCodes.Where(c =>c.UserId ==emailConfirmationCode.UserId && !c.IsUsed).ToListAsync();

            if(activeConfirmationCodes!=null && activeConfirmationCodes.Count > 0)
            {
                foreach (var code in activeConfirmationCodes)
                {
                    code.IsUsed = true;
                }
            }
            
           _context.EmailConfirmationCodes.Add(emailConfirmationCode);
           await _context.SaveChangesAsync();
           return emailConfirmationCode.Id;
        }
        public async Task<EmailConfirmationCode?> GetByIdAsync(int EmailConfirmationId)
        {
           return await _context.EmailConfirmationCodes.SingleOrDefaultAsync(e => e.Id == EmailConfirmationId);
        }

        public async Task<bool> VerifyEmailAsync(int userId, string verificationCode)
        {
            var now = DateTime.Now;

            var activeEmailConfirmation = await _context.EmailConfirmationCodes
                .Include(e => e.User)
                .SingleOrDefaultAsync(e => e.UserId == userId && !e.IsUsed);

            if (activeEmailConfirmation == null)
                throw new ObjectNotFoundException("No valid verification code found for this user.");

            if (activeEmailConfirmation.ExpiresAt < now)
                throw new VerificationCodeException("This verification code has expired. Please request a new one.");

            if (activeEmailConfirmation.IsUsed)
                throw new VerificationCodeException("This verification code has already been used. Please request a new one.");

            if (activeEmailConfirmation.User.IsEmailConfirmed)
                throw new VerificationCodeException("this email already has been verified");


            if (activeEmailConfirmation.Code != verificationCode) return false;
            else
            {
                activeEmailConfirmation.User.IsEmailConfirmed = true;
                activeEmailConfirmation.IsUsed = true;
                await _context.SaveChangesAsync();
                return true;
            }
          
        }


    }
}

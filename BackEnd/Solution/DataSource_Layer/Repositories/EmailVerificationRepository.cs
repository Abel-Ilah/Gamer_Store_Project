using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using DataSource.Data;
using DataSource.DTOs;
using DataSource.Entities;
using DataSource.exceptions;
using Microsoft.EntityFrameworkCore;

namespace DataSource.Repositories
{
    public class EmailVerificationRepository
    {
       private readonly AppDbContext _context;
       
        public EmailVerificationRepository (AppDbContext context)
        {
            _context = context;
        }
      
        public async Task<int>AddAsync(VerificationCode emailConfirmationCode)
        {
            var LastHour = DateTime.Now.AddHours(-1);
            var TotalCodesSentLastHour = await _context.VerificationCodes
                                           .AsNoTracking()
                                           .Where(c => c.UserId == emailConfirmationCode.UserId && c.ExpiresAt >= LastHour)
                                           .CountAsync();
            if (TotalCodesSentLastHour >= 3) throw new Exception("You've requested too many codes. Please wait a few minutes before trying again");


            var activeConfirmationCodes = await _context.VerificationCodes
                .Where(c =>c.UserId == emailConfirmationCode.UserId && !c.IsUsed).ToListAsync();

            if(activeConfirmationCodes!=null && activeConfirmationCodes.Count > 0)
            {
                foreach (var code in activeConfirmationCodes)
                {
                    code.IsUsed = true;
                }
            }
           _context.VerificationCodes.Add(emailConfirmationCode);
           await _context.SaveChangesAsync();
           return emailConfirmationCode.Id;
        }
      

        public async Task<bool> VerifyEmailAsync(VerificationDTO verification)
        {
            var now = DateTime.Now;

            var activeEmailConfirmation = await _context.VerificationCodes
                .Include(e => e.User)
                .OrderByDescending(e => e.CreatedAt)
                .SingleOrDefaultAsync(e => e.User.Email == verification.Email 
                                        && e.Code.ToLower() == verification.Code.ToLower());

            if (activeEmailConfirmation == null)
                throw new ObjectNotFoundException("invalid verification code");

            if (activeEmailConfirmation.ExpiresAt < now)
                throw new VerificationCodeException("verification code has expired.");

            if (activeEmailConfirmation.IsUsed)
                throw new VerificationCodeException("verification code has been used.");

            
                activeEmailConfirmation.User.IsEmailConfirmed = true;
                activeEmailConfirmation.IsUsed = true;
                await _context.SaveChangesAsync();
                return true;
            
          
        }



    }  
}

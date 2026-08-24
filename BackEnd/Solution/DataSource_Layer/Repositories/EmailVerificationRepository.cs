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

        public EmailVerificationRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task<int> AddAsync(EmailVerification newVerification)
        {
            bool exists = await _context.Customers
            .AnyAsync(u => u.Id == newVerification.UserId);

            if (!exists)
                throw new NotFoundException("user not found");
            

            bool isConfirmed = await _context.Customers
                .Where(u => u.Id == newVerification.UserId)
                .Select(u => u.IsEmailConfirmed)
                .FirstAsync();

            if(isConfirmed) throw new BadRequestException("this email has already confirmed");

            var LastHour = DateTime.Now.AddHours(-1);
            var TotalCodesSentLastHour = await _context.EmailsVerifications
                                           .AsNoTracking()
                                           .Where(c => c.UserId == newVerification.UserId && c.ExpiresAt >= LastHour)
                                           .CountAsync();
            if (TotalCodesSentLastHour >= 3) throw new BadRequestException("You've requested too many codes. Please wait a few minutes before trying again");


            var activeConfirmationCodes = await _context.EmailsVerifications
                .Where(c => c.UserId == newVerification.UserId && !c.IsUsed).ToListAsync();

            if (activeConfirmationCodes != null && activeConfirmationCodes.Count > 0)
            {
                foreach (var code in activeConfirmationCodes)
                {
                    code.IsUsed = true;
                }
            }
            _context.EmailsVerifications.Add(newVerification);
            await _context.SaveChangesAsync();
            return newVerification.Id;
        }

        public async Task<bool> VerifyAsync(int userId,string code)
        {
            var now = DateTime.Now;

            var activeEmailConfirmation = await _context.EmailsVerifications.Include(e=>e.User)
                .OrderByDescending(e => e.CreatedAt)
                .SingleOrDefaultAsync(e => e.UserId == userId
                                        && e.Code.Trim() == code.Trim());

            if (activeEmailConfirmation == null)
                throw new NotFoundException("invalid verification code");

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

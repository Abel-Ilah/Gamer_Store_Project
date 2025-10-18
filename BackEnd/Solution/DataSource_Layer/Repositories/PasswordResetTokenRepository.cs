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
    public class PasswordResetTokenRepository
    {
        private readonly AppDbContext _context;

        public PasswordResetTokenRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task<int> AddNewTokenAsync(PasswordResetToken resetToken)
        {
            var LastHour = DateTime.Now.AddHours(-1);
            var TotalTokensSentLastHour = await _context.PasswordResetTokens
                                           .AsNoTracking()
                                           .Where(t => t.UserId == resetToken.UserId && t.ExpiresAt >= LastHour)
                                           .CountAsync();
            if (TotalTokensSentLastHour >= 3) throw new Exception("You've requested too many Tokens. Please wait a few minutes before trying again");


            var activeTokens = await _context.PasswordResetTokens
                .Where(t => t.UserId == resetToken.UserId && !t.IsUsed).ToListAsync();

            if (activeTokens != null && activeTokens.Count > 0)
            {
                foreach (var code in activeTokens)
                {
                    code.IsUsed = true;
                }
            }
            _context.PasswordResetTokens.Add(resetToken);
            await _context.SaveChangesAsync();
            return resetToken.Id;
        }

        public async Task<bool> CreateNewPasswordAsync(string password,string token)
        {
            var resetToken = _context.PasswordResetTokens.Include(t=>t.User).Where(t=>t.Token == token).FirstOrDefault();
            if (resetToken == null) throw new BadRequestException("invalid token");
            if (resetToken.IsUsed) throw new BadRequestException("token has been used");
            if (resetToken.ExpiresAt < DateTime.Now) throw new BadRequestException("token expired");
            if (resetToken.User.Password == password) throw new BadRequestException("you entered and old password, please choose a new one");
            resetToken.User.Password = password;
            resetToken.IsUsed = true;
            await _context.SaveChangesAsync();
            return true;
        }

    }
}

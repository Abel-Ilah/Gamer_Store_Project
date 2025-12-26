using System.Security.Cryptography;
using DataSource.Data;
using DataSource.Entities;
using DataSource.exceptions;
using Microsoft.EntityFrameworkCore;

namespace DataSource.Repositories
{
    public class ResetPasswordRepository
    {
        private readonly AppDbContext _dbContext;
        public ResetPasswordRepository(AppDbContext dbContext) 
        {
            _dbContext = dbContext;
        }

        public async Task<(int Id, string Token)> AddRequestAsync(string  email,string role)
        {
            // check if user (customer / admin) exists :
            var UserId = await _dbContext.Users.AsNoTracking().
                Where(u => u.Email == email && u.Role == role.Trim().ToLower())
                .Select(u => u.Id).FirstOrDefaultAsync();
            if (UserId == 0)
                throw new NotFoundException("Email not found");

            //check if user send request many times in same time:
            var LastHour = DateTime.Now.AddHours(-1);
            var TotalTokensSentLastHour = await _dbContext.PasswordResetTokens
                                           .AsNoTracking()
                                           .Where(t => t.UserId == UserId && t.ExpiresAt >= LastHour)
                                           .CountAsync();
            if (TotalTokensSentLastHour >= 3) throw new BadRequestException("You've requested too many Tokens. Please wait a few minutes before trying again");


            // mark old tokens as used:
            var OldActiveTokens = await _dbContext.PasswordResetTokens
                .Where(t => t.UserId == UserId && !t.IsUsed).ToListAsync();

            if (OldActiveTokens != null && OldActiveTokens.Count > 0)
            {
                foreach (var code in OldActiveTokens)
                {
                    code.IsUsed = true;
                }
            }
            // create new token : 
            string token = GenerateSecureToken();
            var createdAt = DateTime.Now;
            var expiresAt = createdAt.AddMinutes(60);

            var NewToken = new PasswordResetToken
            {
                UserId = UserId,
                Token = token,
                CreatedAt = createdAt,
                ExpiresAt = expiresAt,
                IsUsed = false
            };

            _dbContext.PasswordResetTokens.Add(NewToken);
            await _dbContext.SaveChangesAsync();
            return  (Id:NewToken.Id,Token: NewToken.Token);
        }

        public async Task<bool> SetNewPasswordAsync(string password, string token)
        {
            var resetToken = _dbContext.PasswordResetTokens.Include(t => t.User).Where(t => t.Token == token).FirstOrDefault();
            if (resetToken == null) throw new BadRequestException("invalid token");
            if (resetToken.IsUsed) throw new BadRequestException("token has been used");
            if (resetToken.ExpiresAt < DateTime.Now) throw new BadRequestException("token expired");
            if (resetToken.User.Password == password) throw new BadRequestException("you entered and old password, please choose a new one");
            resetToken.User.Password = password;
            resetToken.IsUsed = true;
            await _dbContext.SaveChangesAsync();
            return true;
        }


        //==== helpers ====

        private string GenerateSecureToken(int length = 32)
        {
            var randomBytes = RandomNumberGenerator.GetBytes(length);
            return Convert.ToBase64String(randomBytes)
                          .Replace("+", "-")
                          .Replace("/", "_")
                          .Replace("=", "");
        }
    }
}

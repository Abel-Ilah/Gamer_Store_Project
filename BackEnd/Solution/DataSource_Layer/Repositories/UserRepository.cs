using System.Data;
using DataSource.Data;
using DataSource.DTOs;
using DataSource.Entities;
using DataSource.exceptions;
using Microsoft.EntityFrameworkCore;

namespace DataSource.Repositories
{
    public class UserRepository
    {
        private readonly AppDbContext _context;

        public UserRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task<User?> GetByIdAsync(int id)
        {
            return await _context.Users.AsNoTracking().FirstOrDefaultAsync(u=>u.Id == id && !u.IsDeleted);
        }

        public async Task<int> AddAsync(User user)
        {
            _context.Users.Add(user);
            await _context.SaveChangesAsync();
            return user.Id;
        }

        public async Task<bool>UpdatePersonalInfoAsync(PersonalInfoDTO info)
        {
            User? user = await _context.Users.FirstOrDefaultAsync(u=>u.Id == info.Id);

            if (user == null)  throw new NotFoundException("User not found");

            user.FirstName = info.FirstName;
            user.LastName = info.LastName;
            user.PhoneNumber = info.PhoneNumber;
            user.Address = info.Address;

            return await _context.SaveChangesAsync() > 0;

        }

        public async Task<bool> ChangePasswordAsync(NewPsswordDTO obj)
        {
            User? user = await _context.Users.FirstOrDefaultAsync(u => u.Id == obj.UserId);

            if (user == null) throw new NotFoundException("User not found");
            if (user.Password != obj.CurrentPassword) throw new BadRequestException("The current password is incorrect");

            user.Password = obj.NewPassword;

            return await _context.SaveChangesAsync() > 0;

        }

        public async Task<bool>DeleteAsync(int id)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Id == id && !u.IsDeleted);

            if (user == null) throw new NotFoundException($"User not found.");
               
            user.IsDeleted = true;
            _context.Users.Update(user);
            int affectedRows = await _context.SaveChangesAsync();
            return affectedRows > 0;
        }

        public async Task<bool> IsEmailExistsAsync(string email)
        {
            return await _context.Users.AnyAsync(u => u.Email == email && !u.IsDeleted);
        }

        public async Task<int>GetUserIdAsync(string email,string role)
        {
            return await _context.Users.AsNoTracking().Where(u=>u.Email == email && !u.IsDeleted && u.Role.Trim().ToLower() == role.Trim().ToLower()).Select(u=>u.Id).FirstOrDefaultAsync();
        }

       


    }
}

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
            return await _context.Users.FindAsync(id);
        }

        public async Task<int> AddAsync(User user)
        {
            _context.Users.Add(user);
            await _context.SaveChangesAsync();
            return user.Id;
        }

        public async Task<bool> UpdateAsync(User user)
        {
            _context.Users.Update(user);
            int affectedRows = await _context.SaveChangesAsync();
            return affectedRows > 0;
        }

        public async Task<bool> IsEmailExistsAsync(string email)
        {
            return await _context.Users.AnyAsync(u => u.Email == email);
        }

        public async Task<int>GetUserId(string email,string role)
        {
            return await _context.Users.AsNoTracking().Where(u=>u.Email == email && u.Role.Trim().ToLower() == role.Trim().ToLower()).Select(u=>u.Id).FirstOrDefaultAsync();
        }


    }
}

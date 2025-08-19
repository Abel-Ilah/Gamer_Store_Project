using DataSource.Data;
using DataSource.Entities;
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

        public async Task<IEnumerable<User>> GetAllCustomersAsync()
        {
            return await _context.Users.AsNoTracking().Where(u=>u.Role=="Customer").ToListAsync();
        }

        public async Task<User?> GetByIdAsync(int id)
        {
            return await _context.Users.FindAsync(id);
        }

        public async Task<User?>GetUserByLoginInfo(string email,string password)
        {
            //hash the password
            var user = await _context.Users.AsNoTracking()
              .SingleOrDefaultAsync(u=>u.Email == email && u.Password ==password);
            return user;
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

        public async Task<bool> DeleteAsync(User user)
        {
            _context.Users.Remove(user);
            int affectedRows = await _context.SaveChangesAsync();
            return affectedRows > 0;
        }

        public async Task<bool> IsEmailExistsAsync(string email)
        {
            return await _context.Users.AnyAsync(u => u.Email == email);
        }

    }
}

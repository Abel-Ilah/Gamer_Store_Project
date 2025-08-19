using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using DataSource.Data;
using DataSource.Entities;
using Microsoft.EntityFrameworkCore;

namespace DataSource.Repositories
{
    public class UserPermissionsRepository
    {
        private readonly AppDbContext _context;

        public UserPermissionsRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<UsersPermission>> GetAllAsync()
        {
            return await _context.UsersPermissions.AsNoTracking().ToListAsync();
        }

        public async Task<UsersPermission?> GetByIdAsync(int id)
        {
            return await _context.UsersPermissions.FindAsync(id);
        }

        public async Task<int> AddAsync(UsersPermission userPermissions)
        {
            _context.UsersPermissions.Add(userPermissions);
            await _context.SaveChangesAsync();
            return userPermissions.Id;
        }

        public async Task<bool> UpdateAsync(UsersPermission userPermissions)
        {
            _context.UsersPermissions.Update(userPermissions);
            int affectedRows = await _context.SaveChangesAsync();
            return affectedRows > 0;
        }

        public async Task<bool> DeleteAsync(UsersPermission userPermissions)
        {
            _context.UsersPermissions.Remove(userPermissions);
            int affectedRows = await _context.SaveChangesAsync();
            return affectedRows > 0;
        }
    }
   
}

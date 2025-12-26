using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using DataSource.Data;
using DataSource.DTOs;
using DataSource.Entities;
using Microsoft.EntityFrameworkCore;

namespace DataSource.Repositories
{
    public class AuthRepository
    {
        private readonly AppDbContext _context;

        public AuthRepository(AppDbContext context)
        { 
            _context = context;
        }

        public async Task<User?> Login(LoginRequestDTO credentials)
        {
            var user = await _context.Users.AsNoTracking()
            .SingleOrDefaultAsync(u => u.Email == credentials.Email && u.Password == credentials.Password && u.Role.ToLower().Trim() == credentials.Role.ToLower().Trim());
            return user;
        }

    }
}

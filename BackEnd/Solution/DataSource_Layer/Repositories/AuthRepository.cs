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

        public async Task<Customer?> CustomerLogin(LoginRequestDTO credentials)
        {
            var user = await _context.Customers.AsNoTracking()
            .SingleOrDefaultAsync(u => !u.IsDeleted && u.Email == credentials.UserName && u.Password == credentials.Password);
            return user;
        }

    }
}


using DataSource.Data;
using DataSource.DTOs;
using DataSource.DTOs.admin;
using DataSource.Entities;
using DataSource.exceptions;
using Microsoft.EntityFrameworkCore;

namespace DataSource.Repositories
{
    public class CustomerRepository
    {
        private readonly AppDbContext _context;

        public CustomerRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task<int> AddAsync(Customer user)
        {
            _context.Customers.Add(user);
            await _context.SaveChangesAsync();
            return user.Id;
        }

        public async Task<int> GetCustomersCountAsync(DateTime from, DateTime to)
        {
            return await _context.Customers.CountAsync(c =>
                c.CreatedAt >= from &&
                c.CreatedAt < to
                );
        }

        public async Task<List<CustomerBasicDto_Admin>> GetCustomersAsync(int pageNumber, int pageSize)
        {
            return await _context.Customers
                .AsNoTracking()
                .Where(c => !c.IsDeleted)
                .OrderByDescending(c => c.CreatedAt)
                .Skip((pageNumber - 1) * pageSize)
                .Take(pageSize)
                .Select(c => new CustomerBasicDto_Admin
                {
                    Id = c.Id,
                    Name = c.FirstName + " " + c.LastName,
                    Email = c.Email,
                    createdAt = DateOnly.FromDateTime(c.CreatedAt)
                })
                .ToListAsync();
        }

        public async Task<FilteredCustomersDTO_Admin> FilterCustomersAsync(CustomersFilterDTO_Admin filter)
        {
            var query = _context.Customers
                .AsNoTracking()
                .Where(c => c.IsDeleted == filter.Deleted);

            var searchName = filter.Search?.Trim();

            bool validName = searchName != null && searchName.Length >= 3;

            if (validName)
            {
                query = query.Where(c =>
                    c.FirstName.Contains(searchName!) ||
                    c.LastName.Contains(searchName!));
            }

            var filteredCustomers = new FilteredCustomersDTO_Admin
            {
                Count = await query.CountAsync()
            };

            query = validName
                ? query.OrderBy(c => c.FirstName)
                : query.OrderByDescending(c => c.CreatedAt);

            filteredCustomers.Customers = await query
                .Skip((filter.PageNumber - 1) * filter.PageSize)
                .Take(filter.PageSize)
                .Select(c => new CustomerInfoDTO
                {
                    Id = c.Id,
                    FirstName = c.FirstName,
                    LastName = c.LastName,
                    Email = c.Email,
                    PhoneNumber = c.PhoneNumber ?? "",
                    CreatedAt = c.CreatedAt,
                    Address = c.Address ?? "",
                    IsEmailConfirmed = c.IsEmailConfirmed,
                    IsDeleted = c.IsDeleted,
                })
                .ToListAsync();

            return filteredCustomers;
        }

        public async Task<bool> UpdatePersonalInfoAsync(CustomerPersonalInfoDTO info)
        {
            Customer? user = await _context.Customers.FirstOrDefaultAsync(u => u.Id == info.Id);

            if (user == null) throw new NotFoundException("User not found");

            user.FirstName = info.FirstName;
            user.LastName = info.LastName;
            user.PhoneNumber = info.PhoneNumber;
            user.Address = info.Address;

            return await _context.SaveChangesAsync() > 0;

        }

        public async Task<bool> ChangePasswordAsync(NewPsswordDTO obj)
        {
            Customer? user = await _context.Customers.FirstOrDefaultAsync(u => u.Id == obj.UserId);

            if (user == null) throw new NotFoundException("User not found");
            if (user.Password != obj.CurrentPassword) throw new BadRequestException("The current password is incorrect");

            user.Password = obj.NewPassword;

            return await _context.SaveChangesAsync() > 0;

        }

        public async Task<bool> DeleteAsync(int id)
        {
            var customer = await _context.Customers.FirstOrDefaultAsync(u => u.Id == id && !u.IsDeleted);

            if (customer == null) throw new NotFoundException($"customer not found.");

            customer.IsDeleted = true;
            _context.Customers.Update(customer);
            int affectedRows = await _context.SaveChangesAsync();
            return affectedRows > 0;
        }

        public async Task<bool> RestoreAsync(int id)
        {
            var customer = await _context.Customers.FirstOrDefaultAsync(u => u.Id == id && u.IsDeleted);

            if (customer == null) throw new NotFoundException($"customer not found.");

            customer.IsDeleted = false;
            _context.Customers.Update(customer);
            int affectedRows = await _context.SaveChangesAsync();
            return affectedRows > 0;
        }

        public async Task<bool> IsEmailExistsAsync(string email)
        {
            return await _context.Customers.AnyAsync(u => u.Email == email);
        }

    }
}

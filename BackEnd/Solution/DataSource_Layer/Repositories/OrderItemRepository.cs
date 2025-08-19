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
    public class OrderItemRepository
    {
        private readonly AppDbContext _context;

        public OrderItemRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<OrderItem>> GetAllAsync()
        {
            return await _context.OrderItems
                .Include(oi => oi.Product)
                .Include(oi => oi.Order)
                .ToListAsync();
        }

        public async Task<OrderItem?> GetByIdAsync(int id)
        {
            return await _context.OrderItems
                .Include(oi => oi.Product)
                .Include(oi => oi.Order)
                .FirstOrDefaultAsync(oi => oi.Id == id);
        }

        public async Task AddAsync(List<OrderItem> items)
        {
            _context.OrderItems.AddRange(items);
            await _context.SaveChangesAsync();
           
        }

        public async Task UpdateAsync(OrderItem item)
        {
            _context.OrderItems.Update(item);
            await _context.SaveChangesAsync();
        }

        public async Task DeleteAsync(OrderItem item)
        {   
            _context.OrderItems.Remove(item);
            await _context.SaveChangesAsync();
        }
    }

}

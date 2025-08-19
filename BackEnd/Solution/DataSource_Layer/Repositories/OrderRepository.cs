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
    public class OrderRepository
    {
        private readonly AppDbContext _context;


        public OrderRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Order>> GetAllAsync()
        {
            return await _context.Orders
                .Include(o => o.User)
                .Include(o => o.OrderItems)
                .ThenInclude(oi => oi.Product)
                .ToListAsync();
        }

        public async Task<Order?> GetByIdAsync(Guid id)
        {
            return await _context.Orders.Include(o=>o.OrderItems).ThenInclude(oi=>oi.Product).ThenInclude(p=>p.ProductImages).AsNoTracking().SingleOrDefaultAsync(o => o.Id == id);
        }

        public async Task<Guid> AddAsync(Order order)
        {
            _context.Orders.Add(order);
            await _context.SaveChangesAsync();
            return order.Id;
        }

        public async Task UpdateAsync(Order order)
        {
            _context.Orders.Update(order);
            await _context.SaveChangesAsync();
        }

        public async Task DeleteAsync(Order order)
        {
            _context.Orders.Remove(order);
            await _context.SaveChangesAsync();
        }

    }

}

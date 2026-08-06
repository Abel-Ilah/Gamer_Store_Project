using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using DataSource.Data;
using DataSource.DTOs;
using DataSource.DTOs.admin;
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

        public async Task <List< OrderReadDTO>> getAllOrdersAsync(int UserId)
        {
            var orders = await _context.Orders.Where(o=>o.UserId==UserId)
                                              .AsNoTracking()
                                              .Include(o => o.OrderItems)
                                              .ThenInclude(oi => oi.Product)
                                              .OrderByDescending(o=>o.OrderDate)
                                              .Select(o => new OrderReadDTO
                                              {
                                                  Id = o.Id,
                                                  UserId = o.UserId,
                                                  OrderDate = o.OrderDate,
                                                  TotalAmount = o.TotalAmount,
                                                  FullName = o.FullName,
                                                  PhoneNumber = o.PhoneNumber,
                                                  Email = o.Email,
                                                  Address = o.Address,
                                                  status = o.Status.Name,
                                                  OrderItems = o.OrderItems.Select(oi => new ReadOrderItemDTO
                                                  {
                                                      Id = oi.Id,
                                                      OrderId = oi.OrderId,
                                                      Quantity = oi.Quantity,
                                                      UnitPrice  = oi.UnitPrice,
                                                      TotalPrice = oi.TotalPrice,
                                                      Product  = new ShortProductDTO
                                                      {
                                                          id = oi.Product.Id,
                                                          name = oi.Product.Name,
                                                          imageUrl = oi.Product.ProductImages
                                                          .Where(i=>i.IsMain)
                                                          .Select(i=>i.ImageUrl)
                                                          .FirstOrDefault()
                                                      }
                                             
                                                  }).ToList()
                                             
             }).ToListAsync();
                                             
             return orders;
        }

        public async Task<int> GetOrdersCountAsync(DateTime from, DateTime to)
        {
            return await _context.Orders.CountAsync(o =>
                o.OrderDate >= from &&
                o.OrderDate < to);
        }

        public async Task<decimal> GetTotalIncomeAsync(DateTime from, DateTime to)
        {
            return await _context.Orders
                .Where(o => o.OrderDate >= from &&
                            o.OrderDate < to)
                .SumAsync(o => o.TotalAmount);
        }

        public async Task<List<OrderDto_Admin>> GetOrders(int pageNumber, int pageSize)
        {
            var query =
                from order in _context.Orders
                orderby order.OrderDate descending
                select new OrderDto_Admin
                {
                    Id = order.Id,
                    CustomerName = order.FullName,
                    Date = order.OrderDate,
                    Amount = order.TotalAmount,
                    Status = order.Status!.Name
                };

            return await query
                .Skip((pageNumber - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();
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

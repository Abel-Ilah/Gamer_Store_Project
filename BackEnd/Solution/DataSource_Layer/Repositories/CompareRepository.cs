using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using DataSource.Data;
using DataSource.DTOs;
using DataSource.Entities;
using DataSource.exceptions;
using Microsoft.EntityFrameworkCore;

namespace DataSource.Repositories
{
    public class CompareRepository
    {
        private readonly AppDbContext _context;
        public CompareRepository( AppDbContext context) 
        {
            _context = context;
        }
        public async Task<int> AddItemAsync(CompareItem item)
        {
            if (_context.CompareItems.Any(i => i.UserId == item.UserId && i.ProductId == item.ProductId))
                throw new AlreadyExitsException("This item is already exists in the compare list");

            _context.CompareItems.Add(item);
            await _context.SaveChangesAsync();
            return item.Id;
        }

        public async Task<bool> AddCollectionOfItemsAsync(List<CompareItem> items)
        {
            var userId = items[0].UserId;

            var existingProductIds = await _context.CompareItems
                .Where(item => item.UserId == userId)
                .Select(w => w.ProductId)
                .ToListAsync();

            var newItems = items
                .Where(item => !existingProductIds.Contains(item.ProductId))
                .ToList();

            if (newItems.Count == 0)
                return false;

            _context.CompareItems.AddRange(newItems);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> DeleteItemAsync(int itemId)
        {
            var item = await _context.CompareItems.SingleOrDefaultAsync(i => i.Id == itemId);
            if (item == null) return false;
            _context.CompareItems.Remove(item);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<List<CompareItemReadDTO>> GetCompareListByUserIdAsync(int userId)
        {
            var compareItems = await (from ci in _context.CompareItems
                                   join p in _context.ProductsView
                                   on ci.ProductId equals p.Id

                                   where ci.UserId == userId

                                   select new CompareItemReadDTO
                                   {
                                       Id = ci.Id,
                                       UserId = ci.UserId,
                                       Product = p
                                   }).ToListAsync();
            return compareItems;

        }
     

    }
}

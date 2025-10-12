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
    public class WishlistRepository
    {
        private readonly AppDbContext _context;

        public WishlistRepository (AppDbContext context)
        {
            _context = context;
        }

        public async Task<int>AddItemAsync(WishlistItem item)
        {
            if(_context.WishlistItems.Any(i => i.UserId == item.UserId && i.ProductId == item.ProductId))
                throw new AlreadyExitsException("This item is already exists in the wishlist");

            _context.WishlistItems.Add(item);
            await _context.SaveChangesAsync();
            return item.Id;
        }

        public async Task<bool> AddCollectionOfItemsAsync(List<WishlistItem> items)
        {
            var userId = items[0].UserId;

            var existingProductIds = await _context.WishlistItems
                .Where(item => item.UserId == userId)
                .Select(w => w.ProductId)
                .ToListAsync();

            var newItems = items
                .Where(item => !existingProductIds.Contains(item.ProductId))
                .ToList();

            if (newItems.Count == 0)
                return false;

            _context.WishlistItems.AddRange(newItems);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> DeleteItemAsync(int itemId)
        {
            var item = await _context.WishlistItems.SingleOrDefaultAsync(i => i.Id == itemId);
            if (item == null) return false;
            _context.WishlistItems.Remove(item);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task <List<WishlistItemReadDTO>>GetWishlistByUesrId(int userId)
        {
           var wishlistItems = await (from ci in _context.WishlistItems
                                      join p in _context.ProductsView
                                      on ci.ProductId equals p.Id

                                      where ci.UserId == userId

                                      select new WishlistItemReadDTO
                                      {
                                          Id = ci.Id,
                                          UserId = ci.UserId,
                                          Product = p
                                      }).ToListAsync();
            return wishlistItems;
        }



    }
}

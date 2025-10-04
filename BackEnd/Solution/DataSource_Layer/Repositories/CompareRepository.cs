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

        public async Task<List<WishlistItemReadDTO>> GetCompareListByUserIdAsync(int userId)
        {
            var today = DateOnly.FromDateTime(DateTime.Now);

            var Wishlist = await (from item in _context.CompareItems

                                  join p in _context.Products
                                  on item.ProductId equals p.Id

                                  join image in _context.ProductImages
                                  on p.Id equals image.ProductId

                                  join poductDiscount in _context.ProductsDiscounts
                                  on p.Id equals poductDiscount.ProductId into pdGroup
                                  from pd in pdGroup.Where(pd => pd.Discount.IsActive == true
                                  && pd.Discount.StartDate <= today
                                  && pd.Discount.EndDate >= today).DefaultIfEmpty()

                                  join categoryDiscount in _context.CategoriesDiscounts
                                  on p.CategoryId equals categoryDiscount.CategoryId into cdGroup
                                  from cd in cdGroup.Where(cd => cd.Discount.IsActive == true
                                  && cd.Discount.StartDate <= today
                                  && cd.Discount.EndDate >= today).DefaultIfEmpty()


                                  where item.UserId == userId
                                  && image.IsMain == true

                                  select new WishlistItemReadDTO
                                  {
                                      Id = item.Id,
                                      UserId = item.UserId,
                                      Product = new ProductDTO
                                      {
                                          Id = p.Id,
                                          Name = p.Name,
                                          Price = p.Price,
                                          Date = p.Date,
                                          QuantityInStock = p.QuantityInStock,
                                          DiscountValue = Math.Max(pd != null ? pd.Discount.Value : 0, cd != null ? cd.Discount.Value : 0),
                                          ImageUrl = image.ImageUrl,
                                      }
                                  }).ToListAsync();
            return Wishlist;
        }
     

    }
}

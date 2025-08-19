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
using Microsoft.VisualBasic;

namespace DataSource.Repositories
{
    public class CartItemRepository
    {
        private readonly AppDbContext _context;
        private readonly ProductRepository _productRepository;
        public CartItemRepository(AppDbContext context,ProductRepository productRepository)
        { 
            _context = context;
            _productRepository = productRepository;
        }

        public async Task<int> AddAsync(CartItem cartItem)
        {
            if (_context.CartItems.Any(ci => ci.UserId == cartItem.UserId && ci.ProductId == cartItem.ProductId))
                throw new AlreadyExitsException("This item is already exists in the cart");

            _context.CartItems.Add(cartItem);
           await _context.SaveChangesAsync();
            return cartItem.Id;
        }

        public async Task<bool> UpdateItemQuantityAsync(int itemId,int quantity)
        {
            var item = await _context.CartItems.Include(i=>i.Product).SingleOrDefaultAsync(i => i.Id == itemId);
            if (item == null) return false;
            if(item.Product.QuantityInStock ==0)
                throw new Exception("The product is out of stock, please remove it form the cart");
            if (item.Product.QuantityInStock < quantity && item.Quantity<= quantity)
               throw new Exception("The selected quantity exceeds the available stock.");

            item.Quantity = quantity;
            await _context.SaveChangesAsync();
            return true;

        }

        public async Task <bool> DeleteItemAsync(int itemId)
        {
            var item =await _context.CartItems.SingleOrDefaultAsync(i=>i.Id == itemId);
            if(item == null) return false;
            _context.CartItems.Remove(item);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> ClearCartAsync(int userId)
        {
            var cart = await _context.CartItems.Where(i => i.UserId == userId).ToListAsync();

            if (cart.Count == 0) return false;

            _context.CartItems.RemoveRange(cart);
            await _context.SaveChangesAsync();
            return true;
        }

        public  async Task<List<CartItemDTO>>GetCartByUserIdAsync(int userId)
        {
            var today = DateOnly.FromDateTime(DateTime.Today);

            var cartItems = await _context.CartItems.Where(ci=>ci.UserId==userId).
                Include(ci=>ci.Product).ThenInclude(p=>p.ProductDiscounts)
                .Include(ci=>ci.Product).ThenInclude(p=>p.Category).ThenInclude(c=>c.CategoriesDiscounts)
                .Include(ci=>ci.Product).ThenInclude(p=>p.ProductImages)
                .Select(  (ci)=> new CartItemDTO
                {
                    Id = ci.Id,
                    userId = ci.UserId,
                    Quantity = ci.Quantity,
                    Product = new ProductDTO()
                    {
                        Id = ci.Product.Id,
                        Name = ci.Product.Name,
                        Price = ci.Product.Price,
                        QuantityInStock = ci.Product.QuantityInStock,
                        Date = ci.Product.Date,
                        ImageUrl = ci.Product.ProductImages.Where(pi => pi.IsMain).Select(pi => pi.ImageUrl).SingleOrDefault(),
                        DiscountValue = Math.Max(
                        ci.Product.ProductDiscounts
                            .Where(pd => pd.Discount.StartDate <= today && pd.Discount.EndDate >= today && pd.Discount.IsActive)
                            .Select(pd => pd.Discount.Value)
                            .FirstOrDefault(),

                        ci.Product.Category.CategoriesDiscounts
                            .Where(cd => cd.Discount.StartDate <= today && cd.Discount.EndDate >= today && cd.Discount.IsActive)
                            .Select(cd => cd.Discount.Value)
                            .FirstOrDefault()
                    ),
                    }
                }).ToListAsync();

            return cartItems;
        
        }
            

    }
}

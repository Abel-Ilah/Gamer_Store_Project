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

        public async Task<bool> AddCollectionOfItemsAsync(List<CartItem> items)
        {
            var userId = items[0].UserId;

            var existingProductIds = await _context.CartItems.Where(item=>item.UserId == userId)
                .Select(w => w.ProductId)
                .ToListAsync();

            var newItems = items
                .Where(item => !existingProductIds.Contains(item.ProductId))
                .ToList();

            if (newItems.Count == 0)
                return false;

            _context.CartItems.AddRange(newItems);
            await _context.SaveChangesAsync();
            return true;
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
            var cartItems = await (from ci in _context.CartItems
                                    join p in _context.ProductsView
                                    on ci.ProductId equals p.Id

                                    where ci.UserId == userId

                                    select new CartItemDTO
                                    {
                                        Id = ci.Id,
                                        userId = ci.UserId,
                                        Quantity = ci.Quantity,
                                        Product = p
                                    }).ToListAsync();

            return cartItems;
        
        }
            

    }
}

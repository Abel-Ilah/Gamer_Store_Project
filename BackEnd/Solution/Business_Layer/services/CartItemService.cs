using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using DataSource.DTOs;
using DataSource.Entities;
using DataSource.Repositories;
using Microsoft.EntityFrameworkCore;

namespace Services.services
{
    public class CartItemService
    {
        private readonly CartItemRepository _cartItemRepository;
        public CartItemService(CartItemRepository cartItemRepository)
        {
            _cartItemRepository = cartItemRepository;
        }

        public async Task<int> AddAsync(CartItem cartItem)
        {
            return await _cartItemRepository.AddAsync(cartItem);
        }

        public async Task<bool> AddCollectionOfItemsAsync(List<CartItem> items)
        {
            return await _cartItemRepository.AddCollectionOfItemsAsync(items);
        }

        public async Task<bool> UpdateItemQuantityAsync(int itemId, int quantity)
        {
         return await _cartItemRepository.UpdateItemQuantityAsync(itemId, quantity);
        }

        public async Task<bool> DeleteItemAsync(int itemId)
        {
           return await _cartItemRepository.DeleteItemAsync(itemId);
        }

        public async Task<bool> ClearCartAsync(int userId)
        {
            return await _cartItemRepository.ClearCartAsync(userId);
        }

        public async Task<List<CartItemDTO>> GetCartByUserIdAsync(int userId)
        {
            return await _cartItemRepository.GetCartByUserIdAsync(userId);
        }

    }
}

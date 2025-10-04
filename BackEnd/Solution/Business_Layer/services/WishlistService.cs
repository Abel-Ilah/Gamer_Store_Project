using DataSource.DTOs;
using DataSource.Entities;
using DataSource.Repositories;

namespace Services.services
{
    public class WishlistService
    {
        WishlistRepository _WishlistRepository;
        public WishlistService(WishlistRepository wishlistRepository)
        {
            _WishlistRepository = wishlistRepository;
        }

        public async Task<int> AddItemAsync(WishlistItem item)
        {
            return await _WishlistRepository.AddItemAsync(item);
        }

        public async Task<bool> AddCollectionOfItemsAsync(List<WishlistItem> items)
        {
            return await _WishlistRepository.AddCollectionOfItemsAsync(items);
        }

        public async Task<bool> DeleteItemAsync(int itemId)
        {
            return await _WishlistRepository.DeleteItemAsync(itemId);
        }

        public async Task<List<WishlistItemReadDTO>>GetWishlistByUserIdAsync(int userId)
        {
            return await _WishlistRepository.GetWishlistByUesrId(userId);
        }
    }
}

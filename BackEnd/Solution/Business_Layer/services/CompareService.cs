using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using DataSource.Data.Config;
using DataSource.DTOs;
using DataSource.Entities;
using DataSource.Repositories;

namespace Services.services
{
    public class CompareService
    {

        private readonly CompareRepository _compareRepo;
        public CompareService(CompareRepository compareRepository) 
        {
            _compareRepo = compareRepository;
        }

        public async Task<int> AddItemAsync(CompareItem item)
        {
            return await _compareRepo.AddItemAsync(item);   
        }

        public async Task<bool> AddCollectionOfItemsAsync(List<CompareItem> items)
        {
            return await _compareRepo.AddCollectionOfItemsAsync(items);
        }

        public async Task<bool> DeleteItemAsync(int itemId)
        {
            return await _compareRepo.DeleteItemAsync(itemId);
        }

        public async Task<List<WishlistItemReadDTO>> GetCompareListByUserIdAsync(int userId)
        {
            return await _compareRepo.GetCompareListByUserIdAsync(userId);
        }
    }
}

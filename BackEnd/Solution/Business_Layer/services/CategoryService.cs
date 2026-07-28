using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Services.services
{
    using System.Collections.Generic;
    using System.Threading.Tasks;
    using DataSource.DTOs;
    using DataSource.Entities;
    using DataSource.Repositories;

    public class CategoryService
    {
        private readonly CategoryRepository _categoryRepository;

        public CategoryService(CategoryRepository categoryRepository)
        {
            _categoryRepository = categoryRepository;
        }

        public async Task<IEnumerable<Category>> GetAllCategoriesAsync()
        {
            return await _categoryRepository.GetAllAsync();
        }

        public async Task<IEnumerable<CategoryDTO>> GetFeaturedCategoriesAsync()
        {
            var categories = await _categoryRepository.GetFeaturedCategoriesAsync();
            return categories.Select(c=>new CategoryDTO { Id=c.Id, Name=c.Name,imagePath =c.ImagePath ,IsFeatured=c.IsFeatured}).ToList();
        }
        public async Task<Category?> GetCategoryByIdAsync(int id)
        {
            return await _categoryRepository.GetByIdAsync(id);
        }

        public async Task AddCategoryAsync(Category category)
        {
            // Add any validation or business rules here
            await _categoryRepository.AddAsync(category);
        }

        public async Task UpdateCategoryAsync(Category category)
        {
            // Add any validation or business rules here
            await _categoryRepository.UpdateAsync(category);
        }

        public async Task DeleteCategoryAsync(int id)
        {
            var category = await _categoryRepository.GetByIdAsync(id);
            if (category != null)
            {
                await _categoryRepository.DeleteAsync(category);
            }
            // Optionally handle not-found cases
        }

      
    }

  
}


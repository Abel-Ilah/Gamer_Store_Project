using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Services.services
{
    using System.Collections.Generic;
    using System.Threading.Tasks;
    using CloudinaryDotNet;
    using DataSource.DTOs;
    using DataSource.DTOs.admin;
    using DataSource.Entities;
    using DataSource.exceptions;
    using DataSource.Repositories;
    using Microsoft.Extensions.Options;
    using Services.Interfaces;

    public class CategoryService
    {
        private readonly CategoryRepository _categoryRepository;
        private readonly ICloudinaryService _cloudinaryService;
        public CategoryService(CategoryRepository categoryRepository,ICloudinaryService cloudinaryService)
        {
            _categoryRepository = categoryRepository;
            _cloudinaryService = cloudinaryService;
            
        }

        public async Task<List<CategoryDTO>> GetAllCategoriesAsync()
        {
            var categories = await _categoryRepository.GetAllAsync();
            return categories.Select(c => new CategoryDTO { Id = c.Id,imagePath =c.ImagePath,Name = c.Name,IsFeatured = c.IsFeatured}).ToList();
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

        public async Task<int> AddAsync(AddCategoryDTO_Admin categoryDto)
        {
            if (categoryDto == null) throw new Exception("category object is null");
            
            if(categoryDto.ImageFile == null) throw new Exception("the uploaded image is null");

            var imagePath = await _cloudinaryService.UploadImageAsync(categoryDto.ImageFile, categoryDto.FileName);

            var category = new Category 
            {
                Name = categoryDto.Name,
                ImagePath =imagePath,
                IsFeatured = categoryDto.IsFeatured
            };
            return await _categoryRepository.AddAsync(category);
        }

        public async Task<bool> UpdateAsync(UpdateCategoryDTO categoryDto)
        {
            if (categoryDto == null) throw new BadRequestException("category object is null");

            var FoundCategory = await GetCategoryByIdAsync(categoryDto.Id);

            if (FoundCategory == null) throw new NotFoundException("category not found");

            string? NewImagePath = null;

            if(categoryDto.ImageFile != null && categoryDto.FileName != null)
            {

                NewImagePath = await _cloudinaryService.UploadImageAsync(categoryDto.ImageFile, categoryDto.FileName);
                
                if (NewImagePath != null)
                {
                    await _cloudinaryService.DeleteImageAsync(_cloudinaryService.GetImagePublicId(FoundCategory.ImagePath));
                    FoundCategory.ImagePath = NewImagePath;
                }

            }
            FoundCategory.Name = categoryDto.Name;
            FoundCategory.IsFeatured = categoryDto.IsFeatured;

            return await _categoryRepository.UpdateAsync(FoundCategory);
        }

        public async Task<bool> DeleteAsync(int id)
        {
          return await _categoryRepository.DeleteAsync(id);
        }

    }

  
}


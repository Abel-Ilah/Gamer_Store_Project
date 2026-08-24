using DataSource.Data;
using DataSource.DTOs;
using DataSource.Entities;
using DataSource.exceptions;
using Microsoft.EntityFrameworkCore;

namespace DataSource.Repositories
{
    public class CategoryRepository
    {
        private readonly AppDbContext _context;

        public CategoryRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Category>> GetAllAsync()
        {
            return await _context.Categories.Where(c=> !c.IsDeleted).ToListAsync();
        }

        public async Task<IEnumerable<Category>> GetFeaturedCategoriesAsync()
        {
            return await _context.Categories.Where(c=>c.IsFeatured && !c.IsDeleted).ToListAsync();
        }

        public async Task<Category?> GetByIdAsync(int id)
        {
            return await _context.Categories.FindAsync(id);
        }

        public async Task<int> AddAsync(Category category)
        {
            _context.Categories.Add(category);
            await _context.SaveChangesAsync();
            return category.Id;
        }

        public async Task<bool> UpdateAsync(Category category)
        {
            var c = await _context.Categories.FindAsync(category.Id);
            if (c == null) throw new NotFoundException("category not found");
            c.Name = category.Name;
            c.IsFeatured = category.IsFeatured;
            c.ImagePath = category.ImagePath;
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> DeleteAsync(int categoryId)
        {
            var category = await _context.Categories.FindAsync(categoryId);
            if (category == null) throw new NotFoundException("category not found");
            category.IsDeleted = true;
            await _context.SaveChangesAsync();
            return true;
        }

    }

}

using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using DataSource.Data;
using DataSource.Entities;
using Microsoft.EntityFrameworkCore;

namespace DataSource.Repositories
{
    public class ProductImageRepository
    {
        private readonly AppDbContext _context;

        public ProductImageRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<ProductImage>> GetAllAsync()
        {
            return await _context.ProductImages.ToListAsync();
        }

        public async Task<ProductImage?> GetByIdAsync(int id)
        {
            return await _context.ProductImages.FindAsync(id);
        }

        public async Task AddAsync(ProductImage image)
        {
            _context.ProductImages.Add(image);
            await _context.SaveChangesAsync();
        }

        public async Task UpdateAsync(ProductImage image)
        {
            _context.ProductImages.Update(image);
            await _context.SaveChangesAsync();
        }

        public async Task DeleteAsync(ProductImage image)
        {
            _context.ProductImages.Remove(image);
            await _context.SaveChangesAsync();
        }
    }

}

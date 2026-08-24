using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Azure.Core;
using DataSource.Data;
using DataSource.DTOs;
using DataSource.DTOs.admin;
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

        public async Task<List<ProductImage>> GetAllAsync(int productId)
        {
           return await _context.ProductImages
                .AsNoTracking()
                .Where(i=>i.ProductId == productId)
                .ToListAsync();
        }

        public async Task DeleteAsync(ProductImage image)
        {
            _context.ProductImages.Remove(image);
            await _context.SaveChangesAsync();
        }

        public async Task<bool> UpdateAsync
        (   int productId,
            IEnumerable<ProductImage> newImages,
            IEnumerable<ProductImage> removedImages,
            UpdateMainImageDTO_Admin updatedMainImage
        )
        {
            await _context.ProductImages.AddRangeAsync(newImages);

            _context.ProductImages.RemoveRange(removedImages);

            if (updatedMainImage != null)
            {
                if (updatedMainImage.OldMainImageId.HasValue)
                {
                    var oldMainImage = await _context.ProductImages
                        .FirstOrDefaultAsync(img =>
                            img.Id == updatedMainImage.OldMainImageId.Value && img.ProductId == productId);

                    if (oldMainImage != null)
                        oldMainImage.IsMain = false;
                }

                if (updatedMainImage.NewMainImageId.HasValue)
                {
                    var newMainImage = await _context.ProductImages
                        .FirstOrDefaultAsync(img =>
                            img.Id == updatedMainImage.NewMainImageId.Value &&
                            img.ProductId == productId);

                    if (newMainImage != null)
                        newMainImage.IsMain = true;

                }
            }

            await _context.SaveChangesAsync();
            Console.WriteLine("=========");
            Console.WriteLine("images are updated");
            Console.WriteLine("=========");
            return true;
        }

    }

}

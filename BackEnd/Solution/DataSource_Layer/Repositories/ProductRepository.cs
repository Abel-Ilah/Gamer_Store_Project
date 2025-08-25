using System.Linq.Expressions;
using DataSource.Data;
using DataSource.DTOs;
using DataSource.Entities;
using Microsoft.EntityFrameworkCore;

namespace DataSource.Repositories
{
    public class ProductRepository
    {
        private readonly AppDbContext _context;

        public ProductRepository(AppDbContext context)
        {
            _context = context;
        }


        public async Task<IEnumerable<ProductDTO>> GetAllAsync(int pageNumber,int pageSize,int minPrice,int maxPrice)
        {
            var today = DateOnly.FromDateTime(DateTime.Today);

            var productsDTOs = await _context.Products
                .Where(p => p.Price >= minPrice && p.Price <= maxPrice).OrderBy(p=>p.Name)
                .Select(p => new ProductDTO
                {
                    Id = p.Id,
                    Name = p.Name,
                   
                    Price = p.Price,
                    QuantityInStock = p.QuantityInStock,
                    Date = p.Date,
                    ImageUrl = p.ProductImages.Where(pi => pi.IsMain).Select(pi => pi.ImageUrl).SingleOrDefault(),
                    DiscountValue = Math.Max(
                        p.ProductDiscounts
                            .Where(pd => pd.Discount.StartDate <= today && pd.Discount.EndDate >= today && pd.Discount.IsActive)
                            .Select(pd => pd.Discount.Value)
                            .FirstOrDefault(),

                        p.Category.CategoriesDiscounts
                            .Where(cd => cd.Discount.StartDate <= today && cd.Discount.EndDate >= today && cd.Discount.IsActive)
                            .Select(cd => cd.Discount.Value)
                            .FirstOrDefault()
                    )

                }).AsNoTracking().Skip((pageNumber - 1) * pageSize).Take(pageSize)
                .ToListAsync();

            return productsDTOs;


        }

        public async Task<IEnumerable<ProductDTO>> GetNewProductsAsync(int pageNumber, int pageSize, int minPrice, int maxPrice)
        {
            var today = DateOnly.FromDateTime(DateTime.Today);
            DateOnly _60DaysAgo = today.AddDays(-60);

            var productsDTOs = await _context.Products
                .Where(p => p.Date >= _60DaysAgo && p.Price >= minPrice && p.Price <= maxPrice)
                .Select(p => new ProductDTO
                {
                    Id = p.Id,
                    Name = p.Name,
                    Price = p.Price,
                    QuantityInStock = p.QuantityInStock,
                    Date = p.Date,
                    ImageUrl = p.ProductImages.Where(pi => pi.IsMain).Select(pi => pi.ImageUrl).SingleOrDefault(),
                    DiscountValue = Math.Max(
                        p.ProductDiscounts
                            .Where(pd => pd.Discount.StartDate <= today && pd.Discount.EndDate >= today && pd.Discount.IsActive)
                            .Select(pd => pd.Discount.Value)
                            .FirstOrDefault(),

                        p.Category.CategoriesDiscounts
                            .Where(cd => cd.Discount.StartDate <= today && cd.Discount.EndDate >= today && cd.Discount.IsActive)
                            .Select(cd => cd.Discount.Value)
                            .FirstOrDefault()
                    )
                }).OrderByDescending(p=>p.Date).Skip((pageNumber - 1) * pageSize).Take(pageSize)
                .ToListAsync();

            return productsDTOs;

        }

        public async Task<IEnumerable<ProductDTO>> GetProductsByCategoryNameAsync(string categoryName, int pageNumber, int pageSize, decimal minPrice, decimal maxPrice)
        {
            
            var today = DateOnly.FromDateTime(DateTime.Today);
           
            var productsDTOs = await _context.Products
                .Where(p => p.Category.Name ==categoryName && p.Price >= minPrice && p.Price <= maxPrice)
                .Select(p => new ProductDTO
                {
                    Id = p.Id,
                    Name = p.Name,
                    Price = p.Price,
                    QuantityInStock = p.QuantityInStock,
                    Date = p.Date,
                    ImageUrl = p.ProductImages.Where(pi => pi.IsMain).Select(pi => pi.ImageUrl).SingleOrDefault(),
                    DiscountValue = Math.Max(
                        p.ProductDiscounts
                            .Where(pd => pd.Discount.StartDate <= today && pd.Discount.EndDate >= today && pd.Discount.IsActive)
                            .Select(pd => pd.Discount.Value)
                            .FirstOrDefault(),

                        p.Category.CategoriesDiscounts
                            .Where(cd => cd.Discount.StartDate <= today && cd.Discount.EndDate >= today && cd.Discount.IsActive)
                            .Select(cd => cd.Discount.Value)
                            .FirstOrDefault()
                    )
                }).Skip((pageNumber - 1) * pageSize).Take(pageSize)
                .ToListAsync();

            return productsDTOs;

        }
     
        public async Task<IEnumerable<ProductDTO>>GetDiscountedProducts(int pageNumber,int pageSize,int minPrice,int maxPrice)
        {
            var today = DateOnly.FromDateTime(DateTime.Today);

            var productsDTOs = await _context.Products
                .Where(p =>
                  (
                    p.ProductDiscounts.Any(pd =>
                    
                        pd.Discount.StartDate <= today &&
                        pd.Discount.EndDate >= today &&
                        pd.Discount.IsActive)
                    ||
                    p.Category.CategoriesDiscounts.Any(cd =>
                        cd.Discount.StartDate <= today &&
                        cd.Discount.EndDate >= today &&
                        cd.Discount.IsActive
                  )
                    &&
                    p.Price >= minPrice && p.Price <= maxPrice
                  ))
                .Select(p => new ProductDTO
                {
                    Id = p.Id,
                    Name = p.Name,
                    Price = p.Price,
                    QuantityInStock = p.QuantityInStock,
                    Date = p.Date,
                    ImageUrl = p.ProductImages.Where(pi => pi.IsMain).Select(pi => pi.ImageUrl).SingleOrDefault(),
                    DiscountValue = Math.Max(
                        p.ProductDiscounts
                            .Where(pd => pd.Discount.StartDate <= today && pd.Discount.EndDate >= today && pd.Discount.IsActive)
                            .Select(pd => pd.Discount.Value)
                            .FirstOrDefault(),

                        p.Category.CategoriesDiscounts
                            .Where(cd => cd.Discount.StartDate <= today && cd.Discount.EndDate >= today && cd.Discount.IsActive)
                            .Select(cd => cd.Discount.Value)
                            .FirstOrDefault()
                    )
                }).Skip((pageNumber - 1)* pageSize).Take(pageSize)
                .ToListAsync();

            return productsDTOs;

        }

        public async Task<IEnumerable<ProductDTO>> GetBestSellers(int pageNumber, int pageSize, int minPrice, int maxPrice)
        {
            var today = DateOnly.FromDateTime(DateTime.Today);
            var productsDTOs = await _context.Products.Where(p => p.Price >= minPrice && p.Price <= maxPrice && p.OrderItems.Any())
                .Select(p => new { product = p, totalSold = p.OrderItems.Sum(oi => oi.Quantity) }
               ).OrderByDescending(obj => obj.totalSold).Select(obj => new ProductDTO
               {
                   Id = obj.product.Id,
                   Name = obj.product.Name,
                   Price = obj.product.Price,
                   QuantityInStock = obj.product.QuantityInStock,
                   Date = obj.product.Date,
                   ImageUrl = obj.product.ProductImages.Where(pi => pi.IsMain).Select(pi => pi.ImageUrl).SingleOrDefault(),
                   DiscountValue = Math.Max(
                     obj.product.ProductDiscounts
                         .Where(pd => pd.Discount.StartDate <= today && pd.Discount.EndDate >= today && pd.Discount.IsActive)
                         .Select(pd => pd.Discount.Value)
                         .FirstOrDefault(),

                     obj.product.Category.CategoriesDiscounts
                         .Where(cd => cd.Discount.StartDate <= today && cd.Discount.EndDate >= today && cd.Discount.IsActive)
                         .Select(cd => cd.Discount.Value)
                         .FirstOrDefault()
                 )

               }).Skip((pageNumber - 1) * pageSize).Take(pageSize).ToListAsync();

                   
            return productsDTOs;
        }

        public async Task<IEnumerable<ProductDTO>> GetRelatedProductsAsync(int productId,int pageSize)
        {
            var today = DateOnly.FromDateTime(DateTime.Today);

            int? CategoryId =await _context.Products.Where(p => p.Id == productId).Select(p => p.CategoryId).SingleOrDefaultAsync();
            if (CategoryId == null) return null;

            var productsDTOs = await _context.Products
                .Where( p=>p.Id !=productId &&  p.CategoryId == CategoryId)
                .Select(p => new ProductDTO
                {
                    Id = p.Id,
                    Name = p.Name,

                    Price = p.Price,
                    QuantityInStock = p.QuantityInStock,
                    Date = p.Date,
                    ImageUrl = p.ProductImages.Where(pi => pi.IsMain).Select(pi => pi.ImageUrl).SingleOrDefault(),
                    DiscountValue = Math.Max(
                        p.ProductDiscounts
                            .Where(pd => pd.Discount.StartDate <= today && pd.Discount.EndDate >= today && pd.Discount.IsActive)
                            .Select(pd => pd.Discount.Value)
                            .FirstOrDefault(),

                        p.Category.CategoriesDiscounts
                            .Where(cd => cd.Discount.StartDate <= today && cd.Discount.EndDate >= today && cd.Discount.IsActive)
                            .Select(cd => cd.Discount.Value)
                            .FirstOrDefault()
                    )

                }).AsNoTracking().Skip(0).Take(pageSize).AsNoTracking()
                .ToListAsync();

            return productsDTOs;
        }

      
        public async Task<ProductDetailsDTO?> GetProductDetailsByIdAsync(int productId)
        {
            var today = DateOnly.FromDateTime(DateTime.Today);

            var productDTO = await _context.Products.Where(p => p.Id == productId).Select(p => new ProductDetailsDTO
            {
                Id = p.Id,
                Name = p.Name,
                Price = p.Price,
                QuantityInStock = p.QuantityInStock,
                Description = p.Description,
                Details = p.Details,
                About = p.About,
                Date = p.Date,
                Images = p.ProductImages.Select(pi => new ProductImageDTO { imageUrl = pi.ImageUrl, isMain = pi.IsMain }).ToList(),
                DiscountValue = Math.Max(
                        p.ProductDiscounts
                            .Where(pd => pd.Discount.StartDate <= today && pd.Discount.EndDate >= today && pd.Discount.IsActive)
                            .Select(pd => pd.Discount.Value)
                            .FirstOrDefault(),

                        p.Category.CategoriesDiscounts
                            .Where(cd => cd.Discount.StartDate <= today && cd.Discount.EndDate >= today && cd.Discount.IsActive)
                            .Select(cd => cd.Discount.Value)
                            .FirstOrDefault()
                    ),
                reviewsCount = p.Reviews.Count,
                Rating = p.Reviews.Any() ? p.Reviews.Average(r => r.Rating) : 0


            }).AsNoTracking().SingleOrDefaultAsync();

            return productDTO;
        }

        public async Task<ProductDTO?> GetProductByIdAsync(int productId)
        {
            var today = DateOnly.FromDateTime(DateTime.Today);

            var product = await _context.Products.Include(p=>p.ProductImages).Where(p => p.Id == productId).Select(p => new ProductDTO
            {
                Id = p.Id,
                Name = p.Name,
                Price = p.Price,
                QuantityInStock = p.QuantityInStock,
                Date = p.Date,
                ImageUrl = p.ProductImages.Where(pi => pi.IsMain).Select(pi => pi.ImageUrl).SingleOrDefault(),
                DiscountValue = Math.Max(
                        p.ProductDiscounts
                            .Where(pd => pd.Discount.StartDate <= today && pd.Discount.EndDate >= today && pd.Discount.IsActive)
                            .Select(pd => pd.Discount.Value)
                            .FirstOrDefault(),

                        p.Category.CategoriesDiscounts
                            .Where(cd => cd.Discount.StartDate <= today && cd.Discount.EndDate >= today && cd.Discount.IsActive)
                            .Select(cd => cd.Discount.Value)
                            .FirstOrDefault()
                    ),

            }).AsNoTracking().SingleOrDefaultAsync();

            return product;
        }

        public async Task AddAsync(Product product)
        {
            _context.Products.Add(product);
            await _context.SaveChangesAsync();
        }

        public async Task UpdateAsync(Product product)
        {
            _context.Products.Update(product);
            await _context.SaveChangesAsync();
        }

        public async Task DeleteAsync(Product product)
        {
            _context.Products.Remove(product);
            await _context.SaveChangesAsync();
        }

        public async Task<List<ShortProductDTO>>FindAsync(string name,int categoryId = 0 )
        {
            var products = categoryId > 0 ?
                await _context.Products.Include(p => p.ProductImages).
                Where(p =>p.CategoryId==categoryId && p.Name.ToLower().Contains(name.ToLower())).Select(p => new ShortProductDTO
                {
                    id = p.Id,
                    name = p.Name,
                    imageUrl = p.ProductImages.Where(pi => pi.IsMain).Select(pi => pi.ImageUrl).FirstOrDefault(),
                }).Skip(0).Take(50).ToListAsync()

                :
                   await _context.Products.Include(p => p.ProductImages).
                Where(p => p.Name.ToLower().Contains(name.ToLower())).Select(p => new ShortProductDTO
                {
                    id = p.Id,
                    name = p.Name,
                    imageUrl = p.ProductImages.Where(pi => pi.IsMain).Select(pi => pi.ImageUrl).FirstOrDefault(),
                }).Skip(0).Take(50).ToListAsync();


            return products !=null ? products : new List<ShortProductDTO>();
        }

    }

}

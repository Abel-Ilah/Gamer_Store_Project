using System.Linq.Expressions;
using System.Security.Cryptography;
using DataSource.Data;
using DataSource.DTOs;
using DataSource.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Query;

namespace DataSource.Repositories
{
    public class ProductRepository
    {
        private readonly AppDbContext _context;

        public ProductRepository(AppDbContext context)
        {
            _context = context;
        }

         
        public async Task<ProductsListDTO?> GetAllProductsAsync(int pageNumber,int pageSize,int minPrice,int maxPrice)
        {
            var today = DateOnly.FromDateTime(DateTime.Today);
            var dto = new ProductsListDTO();
            if (pageNumber == 1)
            {
                dto.TotalProducts = await _context.Products.Where(p=>p.Price>=minPrice && p.Price <=maxPrice).CountAsync();
                if (dto.TotalProducts == 0) return null;
            }
            
            dto.Products = await _context.Products
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

            return dto.Products.Count > 0 ? dto : null;


        }
        public async Task<List<ProductDTO>> GetAllProductsAsync(int pageSize)
        {
            var today = DateOnly.FromDateTime(DateTime.Today);
            var Products = await _context.Products
                .OrderBy(p => p.Name)
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

                }).AsNoTracking().Take(pageSize)
                .ToListAsync();

            return Products;


        }

        public async Task<ProductsListDTO?> GetNewProductsAsync(int pageNumber, int pageSize, int minPrice, int maxPrice)
        {
            var today = DateOnly.FromDateTime(DateTime.Today);
            DateOnly _30DaysAgo = today.AddDays(-30);

            var dto = new ProductsListDTO();
            if (pageNumber == 1)
            {
                dto.TotalProducts = await _context.Products.Where( p => p.Date >= _30DaysAgo && p.Price >= minPrice && p.Price <= maxPrice).CountAsync();
                if (dto.TotalProducts == 0) return null;
            }

             dto.Products = await _context.Products
                .Where(p => p.Date >= _30DaysAgo && p.Price >= minPrice && p.Price <= maxPrice)
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

            return dto.Products.Count > 0 ? dto : null;

        }
        public async Task<List<ProductDTO>> GetNewProductsAsync(int pageSize)
        {
            var today = DateOnly.FromDateTime(DateTime.Today);
            DateOnly _30DaysAgo = today.AddDays(-30);

         
           var Products = await _context.Products
               .Where(p => p.Date >= _30DaysAgo).OrderByDescending(p=>p.Date)
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
               }).OrderByDescending(p => p.Date).Take(pageSize)
               .ToListAsync();

            return Products;

        }

        public async Task<ProductsListDTO?> GetProductsByCategoryNameAsync(string categoryName, int pageNumber, int pageSize, decimal minPrice, decimal maxPrice)
        {
            
            var today = DateOnly.FromDateTime(DateTime.Today);
            var dto = new ProductsListDTO();
            if (pageNumber == 1)
            {
                dto.TotalProducts = await _context.Products.Where(p => p.Category.Name==categoryName && p.Price >= minPrice && p.Price <= maxPrice).CountAsync();
                if (dto.TotalProducts == 0) return null;
            }
            dto.Products = await _context.Products
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

            return dto.Products.Count > 0? dto : null;

        }
        public async Task<List<ProductDTO>> GetProductsByCategoryNameAsync(string categoryName, int pageSize)
        {

            var today = DateOnly.FromDateTime(DateTime.Today);
         
            var Products = await _context.Products
                .Where(p => p.Category.Name == categoryName)
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
                }).Take(pageSize)
                .ToListAsync();

            return Products;

        }

        public async Task<ProductsListDTO?> GetDiscountedProducts(int pageNumber, int pageSize, int minPrice, int maxPrice)
        {
           
            var today = DateOnly.FromDateTime(DateTime.Today);
            var dto = new ProductsListDTO();

          if(pageNumber == 1)
            {
              dto.TotalProducts = await _context.Products
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
                )).CountAsync();
                if (dto.TotalProducts == 0) return null;
            }

            dto.Products = await _context.Set<ProductDTO>().FromSqlRaw("EXEC dbo.GetDiscountedProducts @PageNumber = {0}, @PageSize = {1}, @MinPrice = {2}, @MaxPrice = {3}",pageNumber,pageSize,minPrice,maxPrice).ToListAsync();
            return dto.Products.Count > 0? dto:null;

        }
        public async Task<List<ProductDTO>> GetDiscountedProducts(int pageSize)
        {

            var today = DateOnly.FromDateTime(DateTime.Today);

            var Products = await _context.Set<ProductDTO>().FromSqlRaw("EXEC dbo.GetDiscountedProducts @PageNumber = {0}, @PageSize = {1}, @MinPrice = {2}, @MaxPrice = {3}", 1, pageSize, 1, 10000000).ToListAsync();

            return Products;
        }


        public async Task<ProductsListDTO?> GetBestSellers(int pageNumber, int pageSize, int minPrice, int maxPrice)
        {
            var today = DateOnly.FromDateTime(DateTime.Today);
            var dto = new ProductsListDTO();

             if (pageNumber == 1)
             {
                dto.TotalProducts = await _context.Products.Where(p => p.OrderItems.Any() && p.Price >= minPrice && p.Price <= maxPrice).CountAsync();
                if (dto.TotalProducts == 0) return null;
             }

            dto.Products = await _context.Products.Where(p => p.Price >= minPrice && p.Price <= maxPrice && p.OrderItems.Any())
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


            return dto.Products.Count > 0 ? dto : null;
        }
        public async Task<List<ProductDTO>> GetBestSellers( int pageSize)
        {
            var today = DateOnly.FromDateTime(DateTime.Today);
           
            var Products = await _context.Products.Where(p => p.OrderItems.Any())
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

               }).AsNoTracking().Take(pageSize).ToListAsync();


            return Products;
        }


        public async Task<List<ProductDTO>> GetRelatedProductsAsync(int productId,int pageSize)
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

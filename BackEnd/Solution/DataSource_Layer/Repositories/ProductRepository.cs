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

         
        public async Task<ProductsListDTO> GetAllProductsAsync(int pageNumber,int pageSize,int minPrice,int maxPrice)
        {
            var today = DateOnly.FromDateTime(DateTime.Today);
            var dto = new ProductsListDTO();
            if (pageNumber == 1)
            {
                dto.TotalProducts = await _context.Products.Where(p=>p.Price>=minPrice && p.Price <=maxPrice).CountAsync();
                if (dto.TotalProducts == 0) return dto;
            }

            dto.Products = await _context.ProductsView
                .Where(p => p.Price >= minPrice && p.Price <= maxPrice).OrderBy(p => p.QuantityInStock)
                .AsNoTracking().Skip((pageNumber - 1) * pageSize).Take(pageSize)
                .ToListAsync();

            return dto;


        }
        public async Task<List<vw_Product>> GetAllProductsAsync(int pageSize)
        {
            var Products = await _context.ProductsView
                .OrderBy(p => p.Name)
                .AsNoTracking().Take(pageSize)
                .ToListAsync();

            return Products;

        }

        public async Task<ProductsListDTO> GetNewProductsAsync(int pageNumber, int pageSize, int minPrice, int maxPrice)
        {
            var today = DateOnly.FromDateTime(DateTime.Today);
            DateOnly _30DaysAgo = today.AddDays(-30);

            var dto = new ProductsListDTO();
            if (pageNumber == 1)
            {
                dto.TotalProducts = await _context.Products.Where( p => p.Date >= _30DaysAgo && p.Price >= minPrice && p.Price <= maxPrice).CountAsync();
                if (dto.TotalProducts == 0) return dto; 
            }

             dto.Products = await _context.ProductsView
               .Where(p => p.Date >= _30DaysAgo && p.Price >= minPrice && p.Price <= maxPrice)
               .OrderByDescending(p=>p.Date).Skip((pageNumber - 1) * pageSize).Take(pageSize)
               .AsNoTracking()
               .ToListAsync();

            return dto;

        }
        public async Task<List<vw_Product>> GetNewProductsAsync(int pageSize)
        {
            var today = DateOnly.FromDateTime(DateTime.Today);
            DateOnly _30DaysAgo = today.AddDays(-30);

         
           var Products = await _context.ProductsView
               .Where(p => p.Date >= _30DaysAgo)
               .OrderByDescending(p => p.Date)
               .Take(pageSize)
               .AsNoTracking()
               .ToListAsync();

            return Products;

        }

        public async Task<ProductsListDTO> GetProductsByCategoryIdAsync(int categoryId, int pageNumber, int pageSize, decimal minPrice, decimal maxPrice)
        {
            
            var dto = new ProductsListDTO();
            if (pageNumber == 1)
            {
                dto.TotalProducts = await _context.Products.Where(p => p.CategoryId == categoryId && p.Price >= minPrice && p.Price <= maxPrice).CountAsync();
                if (dto.TotalProducts == 0) return dto;
            }
            dto.Products = await _context.ProductsView
                .Where(p => p.CategoryId == categoryId && p.Price >= minPrice && p.Price <= maxPrice)
                .Skip((pageNumber - 1) * pageSize)
                .Take(pageSize)
                .AsNoTracking()
                .ToListAsync();

            return dto;

        }
        public async Task<List<vw_Product>> GetProductsByCategoryIdAsync(int categoryId, int pageSize)
        {

            var Products = await _context.ProductsView
                .Where(p => p.CategoryId == categoryId)
                .Take(pageSize)
                .AsNoTracking()
                .ToListAsync();

            return Products;

        }

        public async Task<ProductsListDTO> GetDiscountedProducts(int pageNumber, int pageSize, int minPrice, int maxPrice)
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
                if (dto.TotalProducts == 0) return dto;
            }

           dto.Products = await _context.ProductsView.AsNoTracking()
                                                     .Where(p => p.DiscountValue > 0 && p.Price >= minPrice && p.Price <= maxPrice )
                                                     .OrderByDescending(p=>p.Id)
                                                     .Skip(pageSize * (pageNumber -1))
                                                     .Take(pageSize)
                                                     .ToListAsync();
           return dto;

        }
        public async Task<List<vw_Product>> GetDiscountedProducts(int pageSize)
        {
            var today = DateOnly.FromDateTime(DateTime.Today);

           var Products = await _context.ProductsView.Where(p => p.DiscountValue > 0).OrderByDescending(p => p.Id).Take(pageSize).AsNoTracking().ToListAsync();
            return Products;
        }


        public async Task<ProductsListDTO> GetBestSellers(int pageNumber, int pageSize, int minPrice, int maxPrice)
        {
            
            var dto = new ProductsListDTO();

             if (pageNumber == 1)
             {
                dto.TotalProducts = await _context.Products.Where(p => p.OrderItems.Any() && p.Price >= minPrice && p.Price <= maxPrice).CountAsync();
                if (dto.TotalProducts == 0) return dto;
             }

            dto.Products = await (from p in _context.ProductsView
                                  join oi in _context.OrderItems
                                  on p.Id equals oi.ProductId
                                  where p.Price >= minPrice && p.Price <= maxPrice
                                  group oi by p into g
                                  orderby g.Sum(oi => oi.Quantity) descending
                                  select g.Key).Skip(pageSize * (pageNumber - 1)).Take(pageSize).AsNoTracking().ToListAsync();

            return dto;
        }
        public async Task<List<vw_Product>> GetBestSellers( int pageSize)
        {
            var today = DateOnly.FromDateTime(DateTime.Today);
           
            var Products = await (from p in _context.ProductsView
                                  join oi in _context.OrderItems
                                  on p.Id equals oi.ProductId
                                  group oi by p into g
                                  orderby g.Sum(oi => oi.Quantity) descending
                                  select g.Key).Take(pageSize).AsNoTracking().ToListAsync();


            return Products;
        }

        public async Task<ProductsListDTO>GetTopRatedProductsAsync (int pageNumber, int pageSize, int minPrice, int maxPrice)
        {
            var today = DateOnly.FromDateTime(DateTime.Today);
            var dto = new ProductsListDTO();
            if (pageNumber == 1)
            {
                dto.TotalProducts = await _context.Products.Where(p => p.Reviews.Any() && p.Price >= minPrice && p.Price <= maxPrice).CountAsync();
                if (dto.TotalProducts == 0) return dto;
            }

            dto.Products = await _context.ProductsView
                .AsNoTracking()
                .Where(p => p.Rating > 0 && p.Price >= minPrice && p.Price <= maxPrice)
                .OrderByDescending(p=>p.Rating)
                .Skip((pageNumber - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();

             return dto;
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


        public async Task<HeroSectionProducts> GetHeroSectionProductsAsync()
        {
            var lastMonth = DateTime.Now.AddMonths(-1);

            var heroSection = new HeroSectionProducts();

           heroSection.BestSeller = await (from p in _context.ProductsView
                                            join oi in _context.OrderItems
                                            on p.Id equals oi.ProductId
                                            group oi by p into g
                                            orderby g.Sum(oi => oi.Quantity) descending
                                            select g.Key).AsNoTracking().FirstOrDefaultAsync();

            heroSection.New = await (from p in _context.ProductsView
                                     orderby p.Date descending
                                     select p).AsNoTracking().FirstOrDefaultAsync();

            heroSection.TopRated = await (from p in _context.ProductsView
                                          orderby p.Rating descending
                                          select p).AsNoTracking().FirstOrDefaultAsync();

            heroSection.Trending = await (from p in _context.ProductsView
                                    join oi in _context.OrderItems
                                    on p.Id equals oi.ProductId
                                    where oi.Order.OrderDate >= lastMonth
                                    group oi by p into g
                                    orderby g.Sum(x => x.Quantity) descending
                                    select g.Key).AsNoTracking().FirstOrDefaultAsync();

            heroSection.Discounted = await (from p in _context.ProductsView
                                            orderby p.DiscountValue descending
                                            select p
                                            ).AsNoTracking().FirstOrDefaultAsync();

            return heroSection;
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

using System.Collections.Immutable;
using System.Linq.Expressions;
using System.Security.Cryptography;
using DataSource.Data;
using DataSource.DTOs;
using DataSource.DTOs.admin;
using DataSource.Entities;
using DataSource.exceptions;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Query;
using Microsoft.EntityFrameworkCore.Storage.Json;

namespace DataSource.Repositories
{
    public class ProductRepository
    {
        private readonly AppDbContext _context;

        public ProductRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task<ProductsDTO> GetAllProductsAsync(int pageNumber,int pageSize,int minPrice,int maxPrice)
        {
            var today = DateOnly.FromDateTime(DateTime.Today);
            var dto = new ProductsDTO();
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

        public async Task<ProductsDTO> GetNewProductsAsync(int pageNumber, int pageSize, int minPrice, int maxPrice)
        {
            var today = DateOnly.FromDateTime(DateTime.Today);
            DateOnly _30DaysAgo = today.AddDays(-30);

            var dto = new ProductsDTO();
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

        public async Task<ProductsDTO> GetProductsByCategoryIdAsync(int categoryId, int pageNumber, int pageSize, decimal minPrice, decimal maxPrice)
        {
            
            var dto = new ProductsDTO();
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

        public async Task<ProductsDTO> GetDiscountedProducts(int pageNumber, int pageSize, int minPrice, int maxPrice)
        {
           
            var today = DateOnly.FromDateTime(DateTime.Today);
            var dto = new ProductsDTO();

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

        public async Task<ProductsDTO> GetBestSellers(int pageNumber, int pageSize, int minPrice, int maxPrice)
        {
            
            var dto = new ProductsDTO();

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
      
        public async Task<List<vw_Product>> GetBestSellers(int pageSize)
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

        public async Task<List<TopProductDTO_Admin>> GetTopProductsAsync(int pageNumber = 1, int pageSize = 10)
        {
            return await (
                from p in _context.Products 
                join orderItem in _context.OrderItems
                on p.Id equals orderItem.ProductId 
                join image in _context.ProductImages.Where(i=>i.IsMain)
                on p.Id equals image.ProductId
                
                
                group new { orderItem,image} by new 
                { 
                    p.Id, p.Name,
                    p.Price,
                    p.QuantityInStock,
                } into g
                orderby g.Sum(i => i.orderItem.TotalPrice) descending 
                select new TopProductDTO_Admin 
                { 
                    Id = g.Key.Id,
                    Name = g.Key.Name,
                    Price = g.Key.Price, 
                    Quantity = g.Key.QuantityInStock,
                    Sales = g.Sum(i => i.orderItem.Quantity),
                    Revenue = g.Sum(i => i.orderItem.TotalPrice),
                    Image =  g.First().image.ImageUrl
                }).AsNoTracking()
                .Skip((pageNumber - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();
        }
      
        public async Task<ProductsDTO>GetTopRatedProductsAsync (int pageNumber, int pageSize, int minPrice, int maxPrice)
        {
            var today = DateOnly.FromDateTime(DateTime.Today);
            var dto = new ProductsDTO();
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

        public async Task<List<LowStockProductDTO_Admin>>GetLowStockProductsAsync(int pageNumber=1, int pageSize = 10)
        {
            var productsList = await _context.Products
                   .AsNoTracking()
                   .Where(p => p.QuantityInStock < 10)
                   .OrderBy(p => p.QuantityInStock)
                   .Skip((pageNumber - 1) * pageSize)
                   .Take(pageSize)
                   .Select(p => new LowStockProductDTO_Admin
                   {
                       id = p.Id,
                       name = p.Name,
                       imageUrl = p.ProductImages.Where(i=>i.IsMain).Select(i=>i.ImageUrl).SingleOrDefault(),
                       Quantity = p.QuantityInStock,

                   }).ToListAsync();

            return productsList;
        }

        public async Task<ProductDetailsDTO?> GetProductDetailsByIdAsync(int productId)
        {
            var today = DateOnly.FromDateTime(DateTime.Today);

            var product = await _context.Products
                .AsNoTracking()
                .Where(p => p.Id == productId).Select(p => new
                {
                    Id = p.Id,
                    Name = p.Name,
                    Price = p.Price,
                    Category = p.Category.Name,
                    Quantity = p.QuantityInStock,
                    Description = p.Description,
                    Date = p.Date,
                    Details = p.Details,
                    Images = p.ProductImages.Select(pi => new ProductImageDTO {Id=pi.Id, imageUrl = pi.ImageUrl, isMain = pi.IsMain }).ToList(),
                    Discount = Math.Max(
                               p.ProductDiscounts
                              .Where(pd => pd.Discount.StartDate < today && pd.Discount.EndDate > today && pd.Discount.IsActive)
                              .Select(pd => pd.Discount.Value).SingleOrDefault(),

                              p.Category.CategoriesDiscounts
                              .Where(cd => cd.Discount.StartDate < today && cd.Discount.EndDate > today && cd.Discount.IsActive)
                              .Select(cd => cd.Discount.Value).SingleOrDefault()
                              ),
                    TotalReviews = p.Reviews.Count,
                    Rating = p.Reviews.Average(r => (double?)r.Rating) ?? 0
                }).SingleOrDefaultAsync();

             return product == null ? null :
                  new ProductDetailsDTO
                  {
                      Id = product.Id,
                      Name = product.Name,
                      Date = product.Date,
                      Category = product.Category,
                      Price = product.Price,
                      Description = product.Description,
                      Quantity = product.Quantity,
                      Rating = product.Rating,
                      TotalReviews = product.TotalReviews,
                      Discount = product.Discount,
                      Images = product.Images,
                      Details = ParseProductDetails(product.Details, ":", "||")
                  };

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

        
        // admin panel functions : 

        public enum ProductType
        {
            All,
            BestSeller,
            TopRated,
            InStock,
            LowStock,
            NoStock,
            Discounted,
        }

        public static List<ItemDTO> ParseProductDetails(string? details, string keyValueSeparator, string itemSeparator)
        {

            if (string.IsNullOrWhiteSpace(details) || !details.Contains(keyValueSeparator))
                return new List<ItemDTO>();

            return details
                .Split(itemSeparator)
                .Select(item => item.Split(keyValueSeparator,2)).Where(parts=>parts.Length ==2).Select(parts => new ItemDTO
                {
                    Name = parts[0].Trim(),
                    Value = parts[1].Trim()
                }).ToList();
               
        }
       
        public static string? ConvertProductDetailsToString(List<ItemDTO>? details,string keyValueSeparator,string itemSeparator)
        {
           if (details == null || details.Count == 0)
                return null;

            return string.Join(
                itemSeparator,
                details
                    .Where(item => !string.IsNullOrWhiteSpace(item.Name))
                    .Select(item =>
                        $"{item.Name.Trim()}{keyValueSeparator}{item.Value?.Trim() ?? string.Empty}")
            );
        }
       
        public async Task<ProductsDTO_Admin> GetProductsAsync(ProductsFilterDTO_Admin filter)
        {
          
            var dto = new ProductsDTO_Admin();

            var productType = filter.ProductType;

            var query = _context.ProductsView_Admin.AsNoTracking().Where(p=>p.IsDeleted == filter.Deleted);

            if (!string.IsNullOrWhiteSpace(filter.Search) && filter.Search.Trim().Length >= 3)
            {
                query = query.Where(p =>
                EF.Functions.Like(p.Name, $"%{filter.Search}%"));
            }

            if (filter.CategoryId.HasValue)
            {
                query = query.Where(p => p.CategoryId == filter.CategoryId.Value);
            }

            // filtering the products
            switch (productType)
            {
               
                case ProductType.Discounted:
                    query = query.Where(p => p.DiscountValue > 0);
                    break;

                case ProductType.BestSeller:
                    query = query.Where(p => p.Sales > 0);
                    break;

                case ProductType.TopRated:
                    query = query.Where(p => p.Rating > 0);
                    break;

                case ProductType.InStock:
                    query = query.Where(p => p.QuantityInStock > 0);
                    break;

                case ProductType.LowStock:
                    query = query.Where(p => p.QuantityInStock > 0 && p.QuantityInStock < 10);
                               
                    break;

                case ProductType.NoStock:
                    query = query.Where(p => p.QuantityInStock == 0);
                              
                    break;
            }

            if (filter.PageNumber == 1)
            {
                dto.Count = await query.CountAsync();
                if (dto.Count == 0) return dto;
            }

            // ordering the products
            switch (productType)
            {
                case ProductType.All:
                    query = query.OrderBy(p => p.Id);
                    break;

                case ProductType.Discounted:
                    query = query.OrderByDescending(p => p.DiscountValue)
                                 .ThenBy(p => p.Id);
                    break;

                case ProductType.BestSeller:
                    query = query.OrderByDescending(p => p.Sales)
                                 .ThenBy(p => p.Id);
                    break;

                case ProductType.TopRated:
                    query = query.OrderByDescending(p => p.Rating)
                                 .ThenBy(p => p.Id);
                    break;

                case ProductType.InStock:
                    query = query.OrderByDescending(p => p.QuantityInStock)
                                 .ThenBy(p => p.Id);
                    break;

                case ProductType.LowStock:
                    query = query.OrderBy(p => p.QuantityInStock)
                                 .ThenBy(p => p.Id);
                    break;

                case ProductType.NoStock:
                    query = query.OrderBy(p => p.Id);
                    break;

                default:
                    query = query.OrderBy(p => p.Id);
                    break;
            }

            query = query.Skip((filter.PageNumber - 1) * filter.PageSize).Take(filter.PageSize);

            dto.Products = await query.ToListAsync();

            return dto;

        }

        public async Task<ProductBasicInfoDTO?> FindProductAsync(int id)
        {
            var product =  await _context.Products.AsNoTracking().Where(p => p.Id == id).Select(p => new
            {
                Id = p.Id,
                Name = p.Name,
                Date = p.Date,
                Price = p.Price,
                Description = p.Description ?? "",
                Quantity = p.QuantityInStock,
                CategoryId = p.CategoryId,
                Details = p.Details,
                Images = p.ProductImages.Select(img=> new ProductImageDTO { Id = img.Id,imageUrl = img.ImageUrl,isMain = img.IsMain}).ToList(),
            }).SingleOrDefaultAsync();
            if (product == null) return null;

            var productDTO = new ProductBasicInfoDTO
            {
                Id = product.Id,
                Name = product.Name,
                Date = product.Date,
                Price = product.Price,
                Description = product.Description,
                Quantity = product.Quantity,
                Images = product.Images,
                Details = ParseProductDetails(product.Details,":","||"),
                CategoryId = product.CategoryId
            };
            return productDTO;

        }

        public async Task<ProductDetailsDTO_Admin?>GetProductDetailsAsync(int productId)
        {
            DateOnly now = DateOnly.FromDateTime(DateTime.Now);

            var product = await _context.Products.AsNoTracking().Where(p => p.Id == productId).Select(p => new 
            {
                Id = p.Id,
                Name = p.Name,
                Date = p.Date,
                Price = p.Price,
                Description = p.Description ?? "",
                ImageUrl = p.ProductImages.FirstOrDefault(pi => pi.IsMain)!.ImageUrl,
                Category = p.Category.Name,
                Quantity = p.QuantityInStock,
                Details = p.Details,
                Rating = p.Reviews.Average(r => (double?)r.Rating) ?? 0,
                TotalReviews = p.Reviews.Count(),
                Sales = p.OrderItems.Sum(i => i.Quantity),
                Revenue = p.OrderItems.Sum(i => i.TotalPrice),
                Discount = Math.Max(
                                p.ProductDiscounts
                               .Where(pd => pd.Discount.StartDate < now && pd.Discount.EndDate > now && pd.Discount.IsActive)
                               .Select(pd => pd.Discount.Value).SingleOrDefault(),

                               p.Category.CategoriesDiscounts
                               .Where(cd => cd.Discount.StartDate < now && cd.Discount.EndDate > now && cd.Discount.IsActive)
                               .Select(cd => cd.Discount.Value).SingleOrDefault()
                               ),
                
            }).SingleOrDefaultAsync();

            return product == null? null:
                   new ProductDetailsDTO_Admin
                   {
                       Id = product.Id,
                       Name = product.Name,
                       Date = product.Date,
                       Price = product.Price,
                       Description = product.Description,
                       Category = product.Category,
                       Quantity = product.Quantity,
                       Rating = product.Rating,
                       TotalReviews = product.TotalReviews,
                       Sales = product.Sales,
                       Revenue = product.Revenue,
                       Discount = product.Discount,
                       ImageUrl = product.ImageUrl,
                       Details = ParseProductDetails(product.Details, ":", "||")
                   };
                  
        }

        public async Task<int>AddNewProductAsync(Product product)
        {
            _context.Products.Add(product);
            await _context.SaveChangesAsync();
            return product.Id;
        }

        public async Task<bool> UpdateProductAsync(Product product)
        {
           
            var p = await _context.Products.FindAsync(product.Id);
            if (p == null) return false;
            p.Name = product.Name;
            p.Price = product.Price;
            p.QuantityInStock = product.QuantityInStock;
            p.CategoryId = product.CategoryId;
            p.Details = product.Details;
            p.Description = product.Description;
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> DeleteProductAsync(int productId)
        {
            var p = await _context.Products.Where(c =>c.Id == productId && c.IsDeleted == false).SingleOrDefaultAsync();
            if (p == null) throw new NotFoundException("product not found");
            p.IsDeleted = true;
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> RestoreProductAsync(int productId)
        {
            var p = await _context.Products.Where(c=>c.Id == productId && c.IsDeleted == true).SingleOrDefaultAsync();
            if (p == null) throw new NotFoundException("product not found");
            p.IsDeleted = false;
            await _context.SaveChangesAsync();
            return true;
        }

    }

}

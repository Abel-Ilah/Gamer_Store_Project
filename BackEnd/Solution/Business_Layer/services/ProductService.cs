using DataSource.DTOs;
using DataSource.DTOs.admin;
using DataSource.Entities;
using DataSource.Repositories;
using Microsoft.EntityFrameworkCore;
using Microsoft.VisualBasic;

namespace Services.services
{
    public class ProductService
    {
        private readonly ProductRepository _ProductRepository;

        public ProductService(ProductRepository productRepository)
        {
            _ProductRepository = productRepository;
        }

        //get products with filter :
        public async Task<ProductsDTO> GetAllProductsAsync(int pageNumber, int pageSize,int minPrice,int maxPrice)
        {
            return await _ProductRepository.GetAllProductsAsync(pageNumber, pageSize,minPrice,maxPrice);
        }
        public async Task<ProductsDTO> GetNewProductsAsync(int pageNumber, int pageSize, int minPrice, int maxPrice)
        {
            return await _ProductRepository.GetNewProductsAsync(pageNumber, pageSize, minPrice, maxPrice);
        }
        public async Task<ProductsDTO> GetProductsByCategoryIdAsync(int categoryId, int pageNumber, int pageSize, decimal MinPrice, decimal MaxPrice)
        {
            return await _ProductRepository.GetProductsByCategoryIdAsync(categoryId, pageNumber, pageSize, MinPrice, MaxPrice);
        }
        public async Task<ProductsDTO>GetDiscountedProductsAsync(int pageNumber,int pageSize,int minPrice,int maxPrice)
        {
            return await _ProductRepository.GetDiscountedProducts(pageNumber, pageSize,minPrice,maxPrice);
        }
        public async Task<ProductsDTO> GetBestSellersAsync(int pageNumber, int pageSize, int minPrice, int maxPrice)
        {
           return await _ProductRepository.GetBestSellers(pageNumber, pageSize,minPrice,maxPrice);
        }
        public async Task<ProductsDTO> GetTopRatedProductsAsync(int pageNumber, int pageSize, int minPrice, int maxPrice)
        {
            return await _ProductRepository.GetTopRatedProductsAsync(pageNumber, pageSize, minPrice, maxPrice);
        }

        // get products : 
        public async Task<List<vw_Product>> GetAllProductsAsync(int pageSize)
        {
            return await _ProductRepository.GetAllProductsAsync(pageSize);
        }

        public async Task<List<vw_Product>> GetNewProductsAsync(int pageSize)
        {
            return await _ProductRepository.GetNewProductsAsync(pageSize);
        }

        public async Task<List<vw_Product>> GetProductsByCategoryIdAsync(int categoryId, int pageSize)
        {
            return await _ProductRepository.GetProductsByCategoryIdAsync (categoryId,pageSize);
        }

        public async Task<List<vw_Product>> GetDiscountedProductsAsync(int pageSize)
        {
            return await _ProductRepository.GetDiscountedProducts(pageSize);
        }

        public async Task <ProductDetailsDTO?>getProductDetailsByIdAsync(int productId)
        {
            return await _ProductRepository.GetProductDetailsByIdAsync(productId);
        }

        public async Task<List<vw_Product>> GetBestSellersAsync(int pageSize)
        {
            return await _ProductRepository.GetBestSellers(pageSize);
        }

        public async Task<List<ShortProductDTO>> FindAsync(string name, int categoryId = 0)
        {
            return await _ProductRepository.FindAsync(name, categoryId);
        }

        public async Task<HeroSectionProducts> GetHeroSectionProductsAsync()
        {
            return await _ProductRepository.GetHeroSectionProductsAsync();
        }


        // admin panel : 

        public async Task<ProductsDTO_Admin> GetProductsAsync(ProductsFilterDTO_Admin filter)
        {
            return await _ProductRepository.GetProductsAsync(filter);
        }

        public async Task<List<LowStockProductDTO_Admin>> GetLowStockProductsAsync(int pageNumber = 1, int pageSize = 10)
        {
            return await _ProductRepository.GetLowStockProductsAsync(pageNumber,pageSize);
                 
        }

        public async Task<List<TopProductDTO_Admin>> GetTopProductsAsync(int pageNumber = 1, int pageSize = 10)
        {
            return await _ProductRepository.GetTopProductsAsync(pageNumber,pageSize);
        }

    }
}

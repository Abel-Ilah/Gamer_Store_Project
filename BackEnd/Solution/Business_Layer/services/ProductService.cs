using DataSource.DTOs;
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

        public async Task<IEnumerable<ProductDTO>> GetAllProductsAsync(int pageNumber, int pageSize,int minPrice,int maxPrice)
        {
            return await _ProductRepository.GetAllAsync(pageNumber, pageSize,minPrice,maxPrice);
        }

        public async Task<IEnumerable<ProductDTO>> GetNewProductsAsync(int pageNumber, int pageSize, int minPrice, int maxPrice)
        {
            return await _ProductRepository.GetNewProductsAsync(pageNumber, pageSize, minPrice, maxPrice);
        }

        public async Task<IEnumerable<ProductDTO>> GetProductsByCategoryNameAsync(string categoryName, int pageNumber, int pageSize, decimal MinPrice, decimal MaxPrice)
        {
            return await _ProductRepository.GetProductsByCategoryNameAsync(categoryName, pageNumber, pageSize, MinPrice, MaxPrice);
        }
       
        public async Task<IEnumerable<ProductDTO>> GetRelatedProductsAsync(int productId,int pageSize)
        {
            return await _ProductRepository.GetRelatedProductsAsync(productId, pageSize);
        }

        public async Task<IEnumerable<ProductDTO>>GetDiscountedProductsAsync(int pageNumber,int pageSize,int minPrice,int maxPrice)
        {
            return await _ProductRepository.GetDiscountedProducts(pageNumber, pageSize,minPrice,maxPrice);
        }

        public async Task<IEnumerable<ProductDTO>> GetBestSellersAsync(int pageNumber, int pageSize, int minPrice, int maxPrice)
        {
           return await _ProductRepository.GetBestSellers(pageNumber, pageSize,minPrice,maxPrice);
        }

        public async Task <ProductDetailsDTO?>getProductByIdAsync(int productId)
        {
            return await _ProductRepository.GetProductDetailsByIdAsync(productId);
        }

        public async Task<List<ShortProductDTO>> FindAsync(string name, int categoryId = 0)
        {
            return await _ProductRepository.FindAsync(name, categoryId);
        }

    }
}

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

        //get products with filter :
        public async Task<ProductsListDTO?> GetAllProductsAsync(int pageNumber, int pageSize,int minPrice,int maxPrice)
        {
            return await _ProductRepository.GetAllProductsAsync(pageNumber, pageSize,minPrice,maxPrice);
        }
        public async Task<ProductsListDTO?> GetNewProductsAsync(int pageNumber, int pageSize, int minPrice, int maxPrice)
        {
            return await _ProductRepository.GetNewProductsAsync(pageNumber, pageSize, minPrice, maxPrice);
        }
        public async Task<ProductsListDTO?> GetProductsByCategoryNameAsync(string categoryName, int pageNumber, int pageSize, decimal MinPrice, decimal MaxPrice)
        {
            return await _ProductRepository.GetProductsByCategoryNameAsync(categoryName, pageNumber, pageSize, MinPrice, MaxPrice);
        }
        public async Task<ProductsListDTO>GetDiscountedProductsAsync(int pageNumber,int pageSize,int minPrice,int maxPrice)
        {
            return await _ProductRepository.GetDiscountedProducts(pageNumber, pageSize,minPrice,maxPrice);
        }
        public async Task<ProductsListDTO?> GetBestSellersAsync(int pageNumber, int pageSize, int minPrice, int maxPrice)
        {
           return await _ProductRepository.GetBestSellers(pageNumber, pageSize,minPrice,maxPrice);
        }

        // get products : 
        public async Task<List<ProductDTO>> GetAllProductsAsync(int pageSize)
        {
            return await _ProductRepository.GetAllProductsAsync(pageSize);
        }

        public async Task<List<ProductDTO>> GetNewProductsAsync(int pageSize)
        {
            return await _ProductRepository.GetNewProductsAsync(pageSize);
        }

        public async Task<List<ProductDTO>> GetProductsByCategoryNameAsync(string categoryName,int pageSize)
        {
            return await _ProductRepository.GetProductsByCategoryNameAsync (categoryName,pageSize);
        }

        public async Task<List<ProductDTO>> GetDiscountedProductsAsync(int pageSize)
        {
            return await _ProductRepository.GetDiscountedProducts(pageSize);
        }

        public async Task <ProductDetailsDTO?>getProductByIdAsync(int productId)
        {
            return await _ProductRepository.GetProductDetailsByIdAsync(productId);
        }

        public async Task<IEnumerable<ProductDTO>> GetRelatedProductsAsync(int productId,int pageSize)
        {
            return await _ProductRepository.GetRelatedProductsAsync(productId, pageSize);
        }

        public async Task<List<ProductDTO>> GetBestSellersAsync(int pageSize)
        {
            return await _ProductRepository.GetBestSellers(pageSize);
        }

        public async Task<List<ShortProductDTO>> FindAsync(string name, int categoryId = 0)
        {
            return await _ProductRepository.FindAsync(name, categoryId);
        }

    }
}

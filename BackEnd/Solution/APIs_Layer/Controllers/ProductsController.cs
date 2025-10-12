using DataSource.Entities;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Services.services;
using DataSource.DTOs;
namespace APIs.Controllers
{
    [Route("api/products")]
    [ApiController]
    public class ProductsController : ControllerBase
    {
        private readonly ProductService _ProductService;

        public ProductsController(ProductService productService)
        {
            _ProductService = productService;
        }

        [HttpGet]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<ActionResult<ProductsListDTO>> GetAllProducts(int pageNumber, int pageSize,int minPrice,int maxPrice)
        {
            try
            {
                var Products = await _ProductService.GetAllProductsAsync(pageNumber, pageSize,minPrice,maxPrice);
                return Ok(Products);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        [HttpGet("All")]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<ActionResult<List<vw_Product>>> GetAllProducts(int pageSize)
        {
            try
            {
                var Products = await _ProductService.GetAllProductsAsync(pageSize);
                return Ok(Products);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }



        [HttpGet("{id:int}")]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<ActionResult<ProductDetailsDTO>> GetProductDetailsByIdAsync(int id)
        {
            try
            {
                var Product = await _ProductService.getProductDetailsByIdAsync(id);
                return Ok(Product);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }


        [HttpGet("filtered-new-products")]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<ActionResult<ProductsListDTO>> GetNewProducts(int pageNumber, int pageSize, int minPrice, int maxPrice)
        {
            try
            {
                var Products = await _ProductService.GetNewProductsAsync(pageNumber, pageSize,minPrice,maxPrice);
                return Ok(Products);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        [HttpGet("new-products")]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<ActionResult<List<vw_Product>>> GetNewProducts(int pageSize)
        {
            try
            {
                var Products = await _ProductService.GetNewProductsAsync(pageSize);
                return Ok(Products);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }


        [HttpGet("filtered-best-sellers")]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<ActionResult<ProductsListDTO>> GetBestSellers(int pageNumber, int pageSize, int minPrice, int maxPrice)
        {
            try
            {
                var Products = await _ProductService.GetBestSellersAsync(pageNumber, pageSize, minPrice, maxPrice);
                return Ok(Products);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }


        [HttpGet("best-sellers")]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<ActionResult<List<vw_Product>>> GetBestSellers(int pageSize)
        {
            try
            {
                var Products = await _ProductService.GetBestSellersAsync(pageSize);
                return Ok(Products);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }


        [HttpGet("filtered-top-rated")]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<ActionResult<ProductsListDTO>> GetTopRatedProductsAsync(int pageNumber, int pageSize, int minPrice, int maxPrice)
        {
            try
            {
                var Products = await _ProductService.GetTopRatedProductsAsync(pageNumber, pageSize, minPrice, maxPrice);
                return Ok(Products);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }


        [HttpGet("filtered-Category")]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<ActionResult<ProductsListDTO>> GetProductsByCategoryIdAsync(int categoryId, int pageNumber, int pageSize, decimal MinPrice, decimal MaxPrice)
        {
            try
            {
                var Products = await _ProductService.GetProductsByCategoryIdAsync(categoryId, pageNumber, pageSize, MinPrice, MaxPrice);
                return Ok(Products);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        [HttpGet("category")]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<ActionResult<List<vw_Product>>> GetProductsByCategoryIdAsync(int categoryId, int pageSize)
        {
            try
            {
                var Products = await _ProductService.GetProductsByCategoryIdAsync(categoryId, pageSize);
                return Ok(Products);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        [HttpGet("filtered-discounts")]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<ActionResult<ProductsListDTO>> GetDiscountedProducts(int pageNumber, int pageSize, int minPrice, int maxPrice)
        {   
            try
            {
                
                var Products = await _ProductService.GetDiscountedProductsAsync(pageNumber, pageSize, minPrice, maxPrice);
                return Ok(Products);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        [HttpGet("discounts")]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<ActionResult<List<vw_Product>>> GetDiscountedProducts(int pageSize)
        {
            try
            {
                var Products = await _ProductService.GetDiscountedProductsAsync(pageSize);
                return Ok(Products);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }


        [HttpGet("hero-section")]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<ActionResult<HeroSectionProducts>> GetHeroSectionProducts()
        {
            try
            {
                var heroSectionProducts = await _ProductService.GetHeroSectionProductsAsync();   
                return Ok(heroSectionProducts);
            }
            catch(Exception ex) 
            {
               return StatusCode(500, ex.Message);
            }
        }

        [HttpGet("search")]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult<List<ShortProductDTO>>> FindAllAsync(string name, int categoryId )
        {
            if (string.IsNullOrEmpty(name) || name.Length < 3) return Ok(new List<ShortProductDTO>());
            if(categoryId < 0) categoryId = 0;

            try
            {
                var products = await _ProductService.FindAsync(name, categoryId);
                if (products == null || products.Count == 0) return NotFound("No product found");
                return Ok(products);
               
            }
            catch(Exception ex) 
            {
                return StatusCode(500, $"{ex.Message}");
            }

        }

    }
}

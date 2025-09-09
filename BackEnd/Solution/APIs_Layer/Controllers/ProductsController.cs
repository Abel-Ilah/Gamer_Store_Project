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
        public async Task<ActionResult<ProductsListDTO?>> GetAllProducts(int pageNumber, int pageSize,int minPrice,int maxPrice)
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
        public async Task<ActionResult<List<ProductDTO>>> GetAllProducts(int pageSize)
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
        public async Task<ActionResult<ProductDetailsDTO>> GetProductByIdAsync(int id)
        {
            try
            {
                var Product = await _ProductService.getProductByIdAsync(id);
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
        public async Task<ActionResult<ProductsListDTO?>> GetNewProducts(int pageNumber, int pageSize, int minPrice, int maxPrice)
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
        public async Task<ActionResult<List<ProductDTO>>> GetNewProducts(int pageSize)
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
        public async Task<ActionResult<ProductsListDTO?>> GetBestSellers(int pageNumber, int pageSize, int minPrice, int maxPrice)
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
        public async Task<ActionResult<List<ProductDTO>>> GetBestSellers(int pageSize)
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


        [HttpGet("filtered-{category}")]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<ActionResult<ProductsListDTO?>> GetProductsByCategoryName(string category, int pageNumber, int pageSize, decimal MinPrice, decimal MaxPrice)
        {
            try
            {
                var Products = await _ProductService.GetProductsByCategoryNameAsync(category, pageNumber, pageSize, MinPrice, MaxPrice);
                return Ok(Products);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        [HttpGet("{category}")]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<ActionResult<List<ProductDTO>>> GetProductsByCategoryName(string category,int pageSize)
        {
            try
            {
                var Products = await _ProductService.GetProductsByCategoryNameAsync(category, pageSize);
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
        public async Task<ActionResult<ProductsListDTO?>> GetDiscountedProducts(int pageNumber, int pageSize, int minPrice, int maxPrice)
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
        public async Task<ActionResult<List<ProductDTO>>> GetDiscountedProducts(int pageSize)
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


        [HttpGet("related-products")]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<ActionResult<List<ProductDTO>>>GetRelatedProductsAsync(int productId,int pageSize)
        {
            if (productId <= 0) return BadRequest("invalid product id");
            if (pageSize <= 0) return BadRequest("invalid page size");

            try
            {
                var products = await _ProductService.GetRelatedProductsAsync(productId, pageSize);
                if (products == null) return NotFound("no related product found");
                return Ok(products);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"internal server error : {ex.Message}");
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

using DataSource.Entities;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Services.services;
using DataSource.DTOs;
using DataSource.DTOs.admin;
using APIs.DTOs;
using DataSource.exceptions;
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
        public async Task<ActionResult<ProductsDTO>> GetAllProducts(int pageNumber, int pageSize,int minPrice,int maxPrice)
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
        public async Task<ActionResult<ProductsDTO>> GetNewProducts(int pageNumber, int pageSize, int minPrice, int maxPrice)
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
        public async Task<ActionResult<ProductsDTO>> GetBestSellers(int pageNumber, int pageSize, int minPrice, int maxPrice)
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
        public async Task<ActionResult<ProductsDTO>> GetTopRatedProductsAsync(int pageNumber, int pageSize, int minPrice, int maxPrice)
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
        public async Task<ActionResult<ProductsDTO>> GetProductsByCategoryIdAsync(int categoryId, int pageNumber, int pageSize, decimal MinPrice, decimal MaxPrice)
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
        public async Task<ActionResult<ProductsDTO>> GetDiscountedProducts(int pageNumber, int pageSize, int minPrice, int maxPrice)
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



        // admin : 

        [HttpPost("add")]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<ActionResult<int>> AddNewProductAsync([FromForm] AddProductRequestDTO request)
        {
            if (request == null) return BadRequest("product is null");
            if (string.IsNullOrEmpty(request.Name)) return BadRequest("product name required");
            if (string.IsNullOrEmpty(request.Description)) return BadRequest("product description required");
            if (request.Quantity < 0) return BadRequest("product quantity not valid");
            if (request.Price <= 0) return BadRequest("product price not valid");
            if (request.CategoryId <= 0) return BadRequest("categoryID not valid");

            if (request.Images == null || request.Images.Count == 0) return BadRequest("Product needs at least one image");

            if (request.Details != null)
            {
                    request.Details = request.Details
                    .Where(item=>!string.IsNullOrWhiteSpace(item.Name) 
                     && !string.IsNullOrWhiteSpace(item.Value))
                    .ToList();
            }

            var images = new List<ImageUploadDTO>();

            try
            {
                foreach (var imageFile in request.Images)
                {  
                    if(imageFile.Image != null)
                    {
                        var stream = imageFile.Image.OpenReadStream();
                        images.Add(new ImageUploadDTO { Stream = stream, FileName = imageFile.Image.FileName, IsMain = imageFile.IsMain });
                    }
                }

                var productDTO = new AddProductDTO_Admin
                {
                    Name = request.Name,
                    Price = request.Price,
                    CategoryId = request.CategoryId,
                    Description = request.Description,
                    Quantity = request.Quantity,
                    Details = request.Details,
                    Images = images
                };

                int productID = await _ProductService.AddNewProductAsync(productDTO);
                return productID <= 0 ? StatusCode(500, "Product was not added") : Ok(productID);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
            finally
            {
                // dispose stream after service has finished using them
                foreach (var image in images)
                {   
                    if(image.Stream != null)
                    await image.Stream.DisposeAsync();
                }
            }
        }

        [HttpPut("update")]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<ActionResult<int>> UpdateProductAsync([FromForm] UpdateProductRequestDTO updatedProduct)
        {
            if (updatedProduct == null) return BadRequest("product is null");
            if (updatedProduct.Id < 0) return BadRequest("productID not valid");
            if (string.IsNullOrEmpty(updatedProduct.Name)) return BadRequest("product name required");
            if (string.IsNullOrEmpty(updatedProduct.Description)) return BadRequest("product description required");
            if (updatedProduct.Quantity < 0) return BadRequest("product quantity not valid");
            if (updatedProduct.Price <= 0) return BadRequest("product price not valid");
            if (updatedProduct.CategoryId <= 0) return BadRequest("categoryID not valid");

            if (updatedProduct.Images == null || updatedProduct.Images.Count == 0) return BadRequest("Product needs at least one image");

            if (updatedProduct.Details != null)
            {
                updatedProduct.Details = updatedProduct.Details
                .Where(item => !string.IsNullOrWhiteSpace(item.Name)
                 && !string.IsNullOrWhiteSpace(item.Value))
                .ToList();
            }

            var images = new List<ImageUploadDTO>();

            try
            {
                foreach (var imageFile in updatedProduct.Images)
                {   
                    if(imageFile != null) 
                    { 
                      images.Add(new ImageUploadDTO 
                      {
                          Id =imageFile.Id,
                          Stream = imageFile.Image?.OpenReadStream(),
                          FileName = imageFile.Image?.FileName,
                          IsMain = imageFile.IsMain 
                      });
                    }
                }

                var productDTO = new UpdateProductDTO_Admin
                {   Id = updatedProduct.Id,
                    Name = updatedProduct.Name,
                    Price = updatedProduct.Price,
                    CategoryId = updatedProduct.CategoryId,
                    Description = updatedProduct.Description,
                    Quantity = updatedProduct.Quantity,
                    Details = updatedProduct.Details,
                    Images = images
                };


                bool sucess = await _ProductService.UpdateProductAsync(productDTO);
                return sucess ? Ok("product has been updated.") : StatusCode(500, "something went wrong!");
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
            finally
            {
                //// dispose stream after service has finished using them
                //foreach (var image in images)
                //{   if(image.Stream != null)
                //    await image.Stream.DisposeAsync();
                //}
            }
        }

        [HttpDelete("delete/{productId}")]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult<int>> DeleteProductAsync(int productId)
        {
            if (productId <= 0) return BadRequest("not valid producID");

            try
            {
                bool isDeleted = await _ProductService.DeleteProductAsync(productId);
                return isDeleted ? Ok("product has been deleted successfullly."):StatusCode(500, "something went wrong!");
            }
            catch (NotFoundException ex)
            {
                return NotFound(ex.Message);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }

        [HttpPost("restore/{productId}")]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult<int>> RestoreProductAsync(int productId)
        {
            if (productId <= 0) return BadRequest("not valid producID");

            try
            {
                bool isRestored = await _ProductService.RestoreProductAsync(productId);
                return isRestored ? Ok("product has been restored successfullly.") : StatusCode(500, "something went wrong!");
            }
            catch (NotFoundException ex)
            {
                return NotFound(ex.Message);
            }
            catch (Exception ex)
            {
                return StatusCode(500, "internal server error!");
            }
        }

        [HttpGet("filter")]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<ActionResult<ProductsDTO_Admin>> GetProductsAsync([FromQuery] ProductsFilterDTO_Admin filter)
        {
            if (filter == null) return BadRequest("invalid filter");

            if (filter.PageNumber < 0) return BadRequest("filter error : invalid page number");

            if (filter.PageSize < 0) return BadRequest("filter error : invalid page size");

            if(filter.ProductType < 0)filter.ProductType = 0;


            try
            {
                var products = await _ProductService.GetProductsAsync(filter);
                return Ok(products);

            }
            catch(Exception ex)
            {
                return StatusCode(500, ex.Message);
            }

        }


        [HttpGet("find/{productId}")]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task <ActionResult<ProductBasicInfoDTO>>FindProductAsync(int productId)
        {
            if (productId < 0) return BadRequest("productID is not valid");

            try
            {
                var productDTO = await _ProductService.FindProductAsync(productId);
                return productDTO == null ? NotFound("product not found!") : Ok(productDTO);

            }catch(Exception ex)
            {
                return StatusCode(500,ex.Message);
            }
        }


        [HttpGet("product/{productId}")]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult<ProductDetailsDTO_Admin>> GetProductDetailsAsync(int productId)
        {
            if (productId < 0) return BadRequest("productID is not valid");

            try
            {
                var productDTO = await _ProductService.GetProductDetailsAsync(productId);
                return productDTO == null ? NotFound("product not found!") : Ok(productDTO);

            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }

    }
}

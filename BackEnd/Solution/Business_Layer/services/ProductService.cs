using DataSource.DTOs;
using DataSource.DTOs.admin;
using DataSource.Entities;
using DataSource.Repositories;
using Services.Interfaces;

namespace Services.services
{
    public class ProductService
    {
        private readonly ProductRepository _ProductRepository;
        private readonly ICloudinaryService _cloudinaryService;
        private readonly ProductImageRepository _productImagesRepository;
        public ProductService(ProductRepository productRepository, ICloudinaryService cloudinaryService, ProductImageRepository productImagesRepository)
        {
            _ProductRepository = productRepository;
            _cloudinaryService = cloudinaryService;
            _productImagesRepository = productImagesRepository;
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


        // admin : 

        public async Task<int> AddNewProductAsync(AddProductDTO_Admin productDto)
        {
            var productImages = new List<ProductImage>();

            foreach (var image in productDto.Images)
            {
                if(image.Stream != null && image.FileName != null)
                {
                    var imageUrl = await _cloudinaryService.UploadImageAsync(image.Stream,image.FileName);
                    productImages.Add(new ProductImage
                    {
                        ImageUrl = imageUrl,
                        IsMain = image.IsMain
                    });
                } 
             
            }

            // check if product has one and only one main image :
            var mainImagesCount = productImages.Count(img => img.IsMain);
            if (productImages.Count > 0 && mainImagesCount != 1)
            {
                for (int i = 0; i < productImages.Count; i++)
                    productImages[i].IsMain = i == 0;
            }
            var product = new Product
            {
                Name = productDto.Name,
                Price = productDto.Price,
                QuantityInStock = productDto.Quantity,
                CategoryId = productDto.CategoryId,
                Details = ProductRepository.ConvertProductDetailsToString(productDto.Details, ":", "||"),
                Description = productDto.Description,
                Date = DateOnly.FromDateTime(DateTime.Now),
                ProductImages = productImages
            };
             return await _ProductRepository.AddNewProductAsync(product);
        }

        public async Task<bool> UpdateProductAsync(UpdateProductDTO_Admin productDto)
        {
            var OldImages = await _productImagesRepository.GetAllAsync(productDto.Id);

            var uploadedImages = productDto.Images?.ToList() ?? new List<ImageUploadDTO>();

            if (uploadedImages.Count == 0) throw new Exception("you can't delete all images, the product should have at least one image.");

            var oldMainImageId = OldImages.Where(img => img.IsMain).SingleOrDefault()?.Id;


            if (uploadedImages.Count(img => img.IsMain) != 1)
            {
                if (oldMainImageId != null && uploadedImages.Any(img => img.Id == oldMainImageId.Value))
                {
                    for (int i = 0; i < uploadedImages.Count; i++)
                        uploadedImages[i].IsMain = uploadedImages[i].Id == oldMainImageId.Value;

                }
                else
                {
                    for (int i = 0; i < uploadedImages.Count; i++)
                        uploadedImages[i].IsMain = i == 0;
                }
            }

            var updatedMainImage = new UpdateMainImageDTO_Admin
            {
                OldMainImageId = oldMainImageId,
                NewMainImageId = uploadedImages.SingleOrDefault(img => img.IsMain)!.Id
            };


            var newImages = uploadedImages.Where(img=>img.Id == null && img.Stream != null && !string.IsNullOrEmpty(img.FileName)).ToList();

            var addedImages = new List<ProductImage>();

            var deletedImages = new List<ProductImage>();

            //handle new images :

            foreach (var img in newImages)
            {
              if (img.Stream != null && !string.IsNullOrEmpty(img.FileName))
              {
                  string imageUrl = await _cloudinaryService.UploadImageAsync(img.Stream,img.FileName);
                  addedImages.Add(new ProductImage { ImageUrl = imageUrl, IsMain = img.IsMain, ProductId = productDto.Id });
              }
            }

            //handle deleted images :

            foreach (var img in OldImages)
            {
                bool isDeleted = true;
                for (int i = 0; i < uploadedImages.Count; i++)
                {
                   if(img.Id == uploadedImages[i].Id) isDeleted = false;
                }
                if(isDeleted)
                {
                    img.ProductId = productDto.Id;
                    deletedImages.Add(img);
                    await _cloudinaryService.DeleteImageAsync(_cloudinaryService.GetImagePublicId(img.ImageUrl));
                }
            }

            if( await _productImagesRepository.UpdateAsync(productDto.Id, addedImages, deletedImages, updatedMainImage))
            {  
                var product = new Product
                {   Id  = productDto.Id,
                    Name = productDto.Name,
                    Price = productDto.Price,
                    QuantityInStock = productDto.Quantity,
                    Description = productDto.Description,
                    CategoryId = productDto.CategoryId,
                    Details = ProductRepository.ConvertProductDetailsToString(productDto.Details, ":", "||")
                };
                return await _ProductRepository.UpdateProductAsync(product);
            }
            return false;

        }

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

        public async Task<ProductBasicInfoDTO?> FindProductAsync(int id)
        {
            return await _ProductRepository.FindProductAsync(id);
        }

        public async Task<ProductDetailsDTO_Admin?> GetProductDetailsAsync(int productId)
        {
            return await _ProductRepository.GetProductDetailsAsync(productId);
        }

        public async Task<bool> DeleteProductAsync(int porductId)
        {
            return await _ProductRepository.DeleteProductAsync(porductId);
        }

        public async Task<bool> RestoreProductAsync(int productId)
        {
            return await _ProductRepository.RestoreProductAsync(productId);
        }

    }
}

using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace APIs.Controllers
{
    using DataSource.DTOs;
    using DataSource.Entities;
    using Microsoft.AspNetCore.Mvc;
    using Services.services;

    [ApiController]
    [Route("api/reviews")]
    public class ReviewController : ControllerBase
    {
        private readonly ReviewService _reviewService;

        public ReviewController(ReviewService reviewService)
        {
            _reviewService = reviewService;
        }

        [HttpPost("addReview")]
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<ActionResult<ReviewDTO>> AddReviewAsync( ReviewDTO reviewDto)
        {
            if (reviewDto == null) return BadRequest("review object is null");

            var review = new Review
            {
                ProductId = reviewDto.ProductId,
                UserId = reviewDto.UserId,
                Rating = reviewDto.Rating,
                Comment = reviewDto.Comment,
                CreatedAt = DateTime.UtcNow
            };

            try
            {
                var reviewId = await _reviewService.AddReviewAsync(review);
                if (reviewId <= 0) throw new Exception("failed to add the new reiview");
                reviewDto.Id = reviewId;  
                return CreatedAtAction(nameof(GetReviewById), new { id = reviewId }, reviewDto);

            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error: {ex.Message} - Inner: {ex.InnerException?.Message}");
            }
        }

        
        [HttpGet("{id}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<ActionResult<ReadReviewDTO>> GetReviewById(int id)
        { 
            if (id <= 0) return BadRequest("invalid review-id");
            
            try
            {
                var review = await _reviewService.GetReviewByIdAsync(id);

                if (review == null) return NotFound("no review found");

                var dto = new ReadReviewDTO
                {
                    Id = review.Id,
                    ProductId = review.ProductId,
                    UserId = review.UserId,
                    Rating = review.Rating,
                    Comment = review.Comment,
                    CreatedAt = review.CreatedAt,
                    User = new CustomerShortDTO
                    {
                        Id = review.UserId,
                        FirstName = review.User.FirstName,
                        LastName = review.User.LastName,
                    }

                };

                return Ok(dto);
            }
            catch(Exception ex)
            {
                return StatusCode(500, $"{ex.Message}");
            }
        }

        [HttpPut("updateReview")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]

        public async Task<ActionResult<bool>>UpdateReview(ReviewDTO review)
        {
            if (review == null ) return BadRequest("review is null");
            if (review.Id <= 0 ) return BadRequest("invalid reviewId");
            if (review.UserId <= 0 ) return BadRequest("invalid userId");
            if (review.ProductId <= 0 ) return BadRequest("invalid productId");
            if (string.IsNullOrEmpty(review.Comment) ) return BadRequest("comment is empty");
            if (review.Rating <1 || review.Rating > 5) return BadRequest("rating range must be between 1 and 5 stars");

            try
            {
                var UpdatedReview = new Review
                {
                    Id = review.Id,
                    UserId = review.UserId,
                    ProductId = review.ProductId,
                    Comment = review.Comment,
                    Rating = review.Rating

                };
               bool isUpdated =await _reviewService.UpdateReviewAsync(UpdatedReview);

                return isUpdated? Ok(isUpdated) : NotFound("review not exists in the system");
            }
            catch(Exception ex)
            {
                return StatusCode(500, $"internal server error : [{ex.Message}]");
            }

        }


        [HttpDelete("{id}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> DeleteReview(int id)
        {
            if (id <= 0) return BadRequest("invalid id");
            try
            {
                var deleted = await _reviewService.DeleteReviewByIdAsync(id);
                return deleted ? Ok("review has been deleted successfully") : NotFound("review not found");
            }
            catch(Exception ex)
            {
                return StatusCode(500, $"internal server error ({ex.Message})");
            }
           
        }

        [HttpGet("product/{productId}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<ActionResult<List<ReadReviewDTO>>> GetReviewsByProductId(int productId,int pageNumber,int pageSize)
        {
          
            if (productId <= 0) return BadRequest("invalid productId");
            if (pageNumber <= 0) return BadRequest("invalid pageNumber");
            if (pageSize <= 0) return BadRequest("invalid pageSize");

            try
            {
                var reviews = await _reviewService.GetReviewsByProductIdAsync(productId,pageNumber,pageSize);
                if(reviews == null || reviews.Count == 0) return Ok(new List<ReadReviewDTO>());
                var reviewDtos = reviews.Select(r => new ReadReviewDTO
                {
                    Id = r.Id,
                    ProductId = r.ProductId,
                    UserId = r.UserId,
                    Rating = r.Rating,
                    Comment = r.Comment,
                    CreatedAt = r.CreatedAt,
                    User = new CustomerShortDTO 
                       { 
                        Id = r.UserId,
                        FirstName = r.User.FirstName,
                        LastName = r.User.LastName
                       },
                    
                }).ToList();

                return Ok(reviewDtos);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error: {ex.Message} - Inner: {ex.InnerException?.Message}");
            }
        }


        [HttpGet]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]

        public async Task<ActionResult<List<ReadReviewDTO2>>> GetTopReviewsAsync(int pageNumber,int pageSize)
        {
            if (pageSize <= 0) return BadRequest("page size not valide");
            if (pageNumber <= 0) return BadRequest("page number not valide");

            try
            {
                var reviewsList = await _reviewService.GetRecentReviewsAsync(pageNumber,pageSize);
                return Ok(reviewsList);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"internal server error : {ex.Message}");
            }

        }

        [HttpGet("top-reviews")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<ActionResult<List<ReadReviewDTO2>>> GetTopReviewsAsync(int pageSize)
        {
            if (pageSize <= 0) pageSize = 10;

            try
            {
                var reviews = await _reviewService.GetTopReviews(pageSize);
                return reviews != null && reviews.Count > 0 ? Ok(reviews) : NotFound("no review found");
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"internal server error : {ex.Message}");
            }

        }
    }


}

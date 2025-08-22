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
        public async Task<IActionResult> GetReviewById(int id)
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
                    User = new ShortUserDTO
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

        // DELETE: api/review/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteReview(int id)
        {
            var deleted = await _reviewService.DeleteReviewByIdAsync(id);
            return deleted ? NoContent() : NotFound();
        }

        [HttpGet("product/{productId}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<ActionResult<List<ReadReviewDTO>>> GetReviewsByProductId(int productId)
        {
            if (productId <= 0) return BadRequest("invalid productId");

            try
            {
                var reviews = await _reviewService.GetReviewsByProductIdAsync(productId);
                if(reviews == null || reviews.Count == 0) return NotFound("no review found for this product");
                var reviewDtos = reviews.Select(r => new ReadReviewDTO
                {
                    Id = r.Id,
                    ProductId = r.ProductId,
                    UserId = r.UserId,
                    Rating = r.Rating,
                    Comment = r.Comment,
                    CreatedAt = r.CreatedAt,
                    User = new ShortUserDTO 
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
    }

}

using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using DataSource.Entities;
using DataSource.Repositories;

namespace Services.services
{
    public class ReviewService
    {
        private readonly ReviewRepository _reviewRepository;

        public ReviewService(ReviewRepository reviewRepository)
        {
            _reviewRepository = reviewRepository;
        }

        public async Task<int> AddReviewAsync(Review review)
        {
            
            return await _reviewRepository.AddNewAsync(review);
        }

        public async Task<bool> UpdateReviewAsync(Review newReview)
        {
            return await _reviewRepository.UpdateReviewAsync(newReview);
        }

        public async Task<bool> DeleteReviewByIdAsync(int id)
        {
            return await _reviewRepository.DeleteByIdAsync(id);
        }

        public async Task<Review?> GetReviewByIdAsync(int id)
        {
            return await _reviewRepository.GetByIdAsync(id);
        }

        public async Task<List<Review>> GetReviewsByProductIdAsync(int productId)
        {
            return await _reviewRepository.GetReviewsByProductIdAsync(productId);
        }
    
        
    }

}

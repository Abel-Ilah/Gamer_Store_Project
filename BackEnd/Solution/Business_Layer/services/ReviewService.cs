using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using DataSource.DTOs;
using DataSource.DTOs.admin;
using DataSource.Entities;
using DataSource.Repositories;
using Microsoft.VisualBasic;

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

        public async Task<List<Review>> GetReviewsByProductIdAsync(int productId, int pageNumber = 1, int pageSize = 10)
        {
            return await _reviewRepository.GetReviewsByProductIdAsync(productId,pageNumber,pageSize);
        }

        public async Task<List<ReviewDTO_Admin>> GetRecentReviewsAsync(int pageNumber, int pageSize)
        {
            return await _reviewRepository.GetRecentReviewsAsync(pageNumber, pageSize);
        }

        public async Task<List<ReadReviewDTO2>> GetTopReviews(int pageSize)
        {
            return await _reviewRepository.GetTopReviews(pageSize);
        }
    }

}

using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using DataSource.Data;

namespace DataSource.Repositories
{
    using DataSource.DTOs;
    using DataSource.DTOs.admin;
    using DataSource.Entities;
    using Microsoft.EntityFrameworkCore;

    public class ReviewRepository
    {
        private readonly AppDbContext _context;

        public ReviewRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task<int> AddNewAsync(Review review)
        {
            _context.Reviews.Add(review);
            await _context.SaveChangesAsync();
            return review.Id;
        }

        public async Task<bool>UpdateReviewAsync(Review newReview)
        {
            var review = await _context.Reviews.FindAsync(newReview.Id);
            if (review == null) return false;
            review.Comment = newReview.Comment;
            review.Rating = newReview.Rating>= 1 && newReview.Rating <= 5 ? newReview.Rating:5;
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> DeleteByIdAsync(int id)
        {
            var review = await _context.Reviews.FindAsync(id);
            if (review == null)
                return false;
            _context.Reviews.Remove(review);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<Review?> GetByIdAsync(int id)
        {
            return await _context.Reviews.Include(r=>r.User)
                        .SingleOrDefaultAsync(r => r.Id == id);
        }

        public async Task<List<ReviewDTO_Admin>> GetRecentReviewsAsync(int pageNumber,int pageSize)
        {
            var ReviewsList = await (from r in _context.Reviews
                                     join p in _context.Products
                                     on r.ProductId equals p.Id
                                     join u in _context.Customers
                                     on r.UserId equals u.Id
                                     join pi in _context.ProductImages
                                     on p.Id equals pi.ProductId
                                     where pi.IsMain == true

                                     orderby r.CreatedAt descending
                                     
                                     select new ReviewDTO_Admin
                                     {
                                         Id = r.Id,
                                         Rating = r.Rating,
                                         Comment = r.Comment,
                                         CreatedAt = r.CreatedAt,
                                         UserId = r.UserId,
                                         UserName = u.FirstName + " " + u.LastName,
                                         Product = new ShortProductDTO
                                         {
                                             id = p.Id,
                                             name = p.Name,
                                             imageUrl = pi.ImageUrl,
                                         },

                                     }).AsNoTracking().Skip((pageNumber - 1) * pageSize).Take(pageSize).ToListAsync();
            return ReviewsList;
        }

        public async Task<List<Review>> GetReviewsByProductIdAsync(int productId,int pageNumber = 1,int pageSize = 10)
        {
            return await _context.Reviews
                         .AsNoTracking()
                         .Where(r => r.ProductId == productId)
                         .Include(r => r.User)
                         .OrderByDescending(r => r.CreatedAt)
                         .Skip((pageNumber - 1) * pageSize)
                         .Take(pageSize)
                         .ToListAsync();
        }

        public async Task<List<ReadReviewDTO2>> GetTopReviews(int pageSize)
        {
            var TopReviews =await (from r in _context.Reviews
                              join p in _context.Products
                              on r.ProductId equals p.Id
                              join u in _context.Customers
                              on r.UserId equals u.Id
                              join pi in _context.ProductImages
                              on p.Id equals pi.ProductId
                              where pi.IsMain == true

                              orderby r.Rating descending

                              select new ReadReviewDTO2
                              {
                                  Id = r.Id,
                                  Rating = r.Rating,
                                  Comment = r.Comment,
                                  CreatedAt = r.CreatedAt,
                                  Product = new ShortProductDTO
                                  {
                                      id = p.Id,
                                      name = p.Name,
                                      imageUrl = pi.ImageUrl,
                                  },
                                  UserName = u.FirstName,
                              }).ToListAsync();
            return TopReviews;
        }

    } 



}

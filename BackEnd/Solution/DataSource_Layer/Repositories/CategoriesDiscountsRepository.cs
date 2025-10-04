
using DataSource.Data;
using DataSource.DTOs;
using Microsoft.EntityFrameworkCore;

namespace DataSource.Repositories
{
    public class CategoriesDiscountsRepository
    {
        private readonly AppDbContext _context;
        public CategoriesDiscountsRepository(AppDbContext context) { _context = context; }
        
        public async Task<DiscountedCategoryDTO?> getLastDiscoutedCategoryAsync()
        {
            var today = DateOnly.FromDateTime(DateTime.Now);

            var category = await (from d in _context.Discounts
                                  join cd in _context.CategoriesDiscounts
                                  on d.Id equals cd.DiscountId

                                  join c in _context.Categories
                                  on cd.CategoryId equals c.Id

                                  where d.IsActive && d.StartDate <= today && d.EndDate >= today
                                  orderby d.StartDate descending

                                  select new DiscountedCategoryDTO
                                  {
                                      Id = c.Id,
                                      Name = c.Name,
                                      imagePath = c.ImagePath,
                                      DiscountValue = d.Value,
                                      StartDate  = d.StartDate,
                                      EndDate = d.EndDate
                                      

                                  }).FirstOrDefaultAsync();

            return category;
        }


    }
}

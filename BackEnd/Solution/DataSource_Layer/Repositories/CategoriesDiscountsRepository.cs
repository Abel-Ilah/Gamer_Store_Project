
using DataSource.Data;

namespace DataSource.Repositories
{
    public class CategoriesDiscountsRepository
    {
        private readonly AppDbContext _context;
        public CategoriesDiscountsRepository(AppDbContext context) { _context = context; }
   
    }
}

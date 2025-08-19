using DataSource.Data;

namespace DataSource.Repositories
{
    public class ProductsDiscountsRepository
    {
        private readonly    AppDbContext _Context;
        public ProductsDiscountsRepository(AppDbContext context) { _Context = context; }
   
    }
}

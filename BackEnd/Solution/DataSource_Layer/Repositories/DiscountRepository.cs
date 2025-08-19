using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using DataSource.Data;

namespace DataSource.Repositories
{
    public class DiscountRepository
    {
       private readonly AppDbContext _context;
        public DiscountRepository(AppDbContext context) { _context = context; }



    }
}

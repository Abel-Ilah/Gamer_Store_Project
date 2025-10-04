using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using DataSource.DTOs;
using DataSource.Repositories;

namespace Services.services
{
    public class CategoriesDiscountsService
    {
        private readonly CategoriesDiscountsRepository _cdRepository;
        public CategoriesDiscountsService( CategoriesDiscountsRepository cdRepo)
        {
            _cdRepository = cdRepo;
        }

        public async Task<DiscountedCategoryDTO?> getLastDiscoutedCategoryAsync()
        {
            return await _cdRepository.getLastDiscoutedCategoryAsync();
        }

    }
}

using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.CompilerServices;
using System.Text;
using System.Threading.Tasks;
using DataSource.Repositories;

namespace Services.services
{
    public class ProductImageService
    {
        private readonly ProductImageRepository _ProductImageRepsitory;

        public ProductImageService(ProductImageRepository ProductImageRepsitory)
        {
            _ProductImageRepsitory = ProductImageRepsitory;
        }
    }
}

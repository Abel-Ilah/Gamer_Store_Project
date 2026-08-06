using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DataSource.DTOs.admin
{
    public class LowStockProductDTO_Admin:ShortProductDTO
    {
        public int Quantity { get; set; }

    }
}

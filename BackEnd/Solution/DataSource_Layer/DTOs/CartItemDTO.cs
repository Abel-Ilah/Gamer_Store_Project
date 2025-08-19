using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using DataSource.Entities;

namespace DataSource.DTOs
{
    public partial class CartItemDTO
    {
        public int Id { get; set; }
        public int userId { get; set; }
        public virtual ProductDTO Product { get; set; } = null!;
        public int Quantity { get; set; }

    }

    public partial class CartItemWriteDTO
    {
        public int Id { get; set; }
        public int userId { get; set; }
        public int productId { get; set; }
        public int Quantity { get; set; }

    }

}

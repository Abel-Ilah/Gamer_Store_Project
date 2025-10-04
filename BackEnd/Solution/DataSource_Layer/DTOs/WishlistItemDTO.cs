using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DataSource.DTOs
{
    public class WishlistItemDTO
    {
        public int Id { get; set; }

        public int UserId { get; set; }

        public int ProductId { get; set; }
    }
}

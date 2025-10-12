using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using DataSource.Entities;

namespace DataSource.DTOs
{
    public class WishlistItemReadDTO
    {
        public int Id { get; set; }

        public int UserId { get; set; }

        public vw_Product Product { get; set; } = null!;
    }
}

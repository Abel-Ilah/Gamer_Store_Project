using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DataSource.DTOs.admin
{
    public class TopProductDTO_Admin
    {
        public int Id { get; set; }
        public string Name { get; set; } = null!;
        public int Quantity { get; set; }
        public decimal Price { get; set; }
        public int Sales {  get; set; }
        public decimal Revenue { get; set; }
        public string Image { get; set; } = null!;

    }
}

using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DataSource.DTOs
{
    public class ProductImageDTO
    {
        public int Id {get; set;}
        public string imageUrl { get; set; } = "";
        public bool isMain { get; set; }=false;
    }
}

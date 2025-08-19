using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DataSource.DTOs
{
    public class ShortProductDTO
    {
        public int id {  get; set; }
        public string name { get; set; } = "";
        public string? imageUrl { get; set; }
    }
}

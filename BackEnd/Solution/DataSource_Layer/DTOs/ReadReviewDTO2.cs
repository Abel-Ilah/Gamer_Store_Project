using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using DataSource.Entities;

namespace DataSource.DTOs
{
    public class ReadReviewDTO2
    {
        public int Id { get; set; }
        public int Rating { get; set; } = 5;
        public string? Comment { get; set; }
        public DateTime CreatedAt { get; set; }
        public ShortProductDTO Product { get; set; } = null!;
        public string UserName { get; set; } = null!;
    }
}

using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DataSource.Entities
{
    public class Review
    {
        public int Id { get; set; }
        public int ProductId { get; set; }
        public int UserId { get; set; }
        public int Rating { get; set; } = 5;
        public string? Comment { get; set; }
        public DateTime CreatedAt { get; set; }
        public Product Product { get; set; } = null!;
        public Customer User { get; set; } = null!;
    }

}

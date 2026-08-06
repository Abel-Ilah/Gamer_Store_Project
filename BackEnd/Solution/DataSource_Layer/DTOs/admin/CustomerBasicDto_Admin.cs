using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DataSource.DTOs.admin
{
    public class CustomerBasicDto_Admin
    {
        public int Id { get; set; }
        public string Name { get; set; } = null!;
        public string Email { get; set; } = null!;
        public DateOnly createdAt { get; set; }
    }
}

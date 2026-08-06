using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using DataSource.Entities;

namespace DataSource.DTOs.admin
{
    public class OrderDto_Admin
    {
        public Guid Id { get; set; }

        public string CustomerName { get; set; } = null!;

        public decimal Amount { get; set; }

        public string Status { get; set; } = null!;

        public DateTime Date { get; set; }
    }
}

using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DataSource.DTOs
{
    public class OrderItemDTO
    {
        public int Id { get; set; }

        public Guid OrderId { get; set; }

        public int ProductId { get; set; }

        public int Quantity { get; set; }

        public decimal UnitPrice { get; set; }

        public decimal TotalPrice { get; set; }

    }

    public class ReadOrderItemDTO
    {
        public int Id { get; set; }

        public Guid OrderId { get; set; }

        public int Quantity { get; set; }

        public decimal UnitPrice { get; set; }

        public decimal TotalPrice { get; set; }

        public ShortProductDTO Product { get; set; } = null!;
    }


}

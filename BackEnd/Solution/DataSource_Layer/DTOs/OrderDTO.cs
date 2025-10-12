using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using DataSource.Entities;

namespace DataSource.DTOs
{
    public class OrderDTO
    {
        public Guid Id { get; set; }

        public int? UserId { get; set; }

        public DateTime OrderDate { get; set; }

        public decimal? TotalAmount { get; set; }

        public string FullName { get; set; } = null!;

        public string? Email { get; set; } = null;

        public string PhoneNumber { get; set; } = null!;

        public string Address { get; set; } = null!;

        
    }

    public class OrderReadDTO:OrderDTO
    {
      public string status { get; set; }= null!;
      public virtual ICollection<ReadOrderItemDTO> OrderItems { get; set; } = new List<ReadOrderItemDTO>();

    }
    public class WriteOrderDTO:OrderDTO
    {
        public int StatusId { get; set; }

        public virtual ICollection<OrderItemDTO> OrderItems { get; set; } = new List<OrderItemDTO>();

    }
}

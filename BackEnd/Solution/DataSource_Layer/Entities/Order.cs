using System;
using System.Collections.Generic;

namespace DataSource.Entities;
public partial class Order
{
    public Guid Id { get; set; }

    public int? UserId { get; set; }

    public DateTime OrderDate { get; set; }

    public decimal TotalAmount { get; set; }
    
    public int StatusId { get; set; }

    public string FullName { get; set; } = null!;

    public string? Email { get; set; } 

    public string PhoneNumber { get; set; } = null!;

    public string Address { get; set; } = null!;

    public virtual ICollection<OrderItem> OrderItems { get; set; } = new List<OrderItem>();

    public virtual OrderStatus? Status { get; set; }

    public virtual User? User { get; set; }
}


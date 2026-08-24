using System;
using System.Collections.Generic;

namespace DataSource.Entities;

public partial class CartItem
{
    public int Id { get; set; }

    public int UserId { get; set; }

    public int ProductId { get; set; }

    public int Quantity { get; set; }

    public virtual Product Product { get; set; } = null!;

    public virtual Customer User { get; set; } = null!;
}

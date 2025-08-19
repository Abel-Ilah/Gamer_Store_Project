using System;
using System.Collections.Generic;

namespace DataSource.Entities;

public partial class WishlistItem
{
    public int Id { get; set; }

    public int UserId { get; set; }

    public int ProductId { get; set; }

    public virtual Product Product { get; set; } = null!;

    public virtual User User { get; set; } = null!;
}

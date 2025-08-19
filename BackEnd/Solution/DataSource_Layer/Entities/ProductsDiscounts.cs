using System;
using System.Collections.Generic;

namespace DataSource.Entities;
public partial class ProductsDiscounts
{
    public int Id { get; set; }

    public int ProductId { get; set; }

    public int DiscountId { get; set; }

    public virtual Discount Discount { get; set; } = null!;

    public virtual Product Product { get; set; } = null!;
}

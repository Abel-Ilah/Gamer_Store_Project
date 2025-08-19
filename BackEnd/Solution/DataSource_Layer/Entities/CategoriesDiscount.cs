using System;
using System.Collections.Generic;

namespace DataSource.Entities;
public partial class CategoriesDiscount
{
    public int Id { get; set; }

    public int CategoryId { get; set; }

    public int DiscountId { get; set; }

    public virtual Category Category { get; set; } = null!;

    public virtual Discount Discount { get; set; } = null!;
}

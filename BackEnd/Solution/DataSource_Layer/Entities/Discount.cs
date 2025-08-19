using System;
using System.Collections.Generic;

namespace DataSource.Entities;
public partial class Discount
{
    public int Id { get; set; }

    public string Name { get; set; } = null!;

    public decimal Value { get; set; }

    public DateOnly StartDate { get; set; }

    public DateOnly EndDate { get; set; }

    public bool IsActive { get; set; }

    public virtual ICollection<CategoriesDiscount> CategoriesDiscounts { get; set; } = new List<CategoriesDiscount>();

    public virtual ICollection<ProductsDiscounts> ProductsDiscounts { get; set; } = new List<ProductsDiscounts>();
}

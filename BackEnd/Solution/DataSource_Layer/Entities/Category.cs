using System;
using System.Collections.Generic;

namespace DataSource.Entities;
public partial class Category
{
    public int Id { get; set; }
    public string Name { get; set; } = null!;
    public string ImagePath { get; set; } = "";
    public bool IsFeatured { get; set; } = false;
    public bool IsDeleted { get; set; } = false;

    public virtual ICollection<CategoriesDiscount> CategoriesDiscounts { get; set; } = new List<CategoriesDiscount>();

    public virtual ICollection<Product> Products { get; set; } = new List<Product>();
}

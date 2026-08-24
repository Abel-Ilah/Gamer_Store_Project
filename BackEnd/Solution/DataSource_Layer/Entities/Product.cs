using System;
using System.Collections.Generic;
using DataSource.Entities;

namespace DataSource.Entities;
public partial class Product
{
    public int Id { get; set; }

    public string Name { get; set; } = null!;
   
    public string Description { get; set; } = string.Empty;

    public string? Details { get; set; } 
     
    public decimal Price { get; set; }

    public int QuantityInStock { get; set; }

    public int CategoryId { get; set; }

    public DateOnly Date { get; set; }

   public bool IsDeleted { get; set; } = false;
    public virtual ICollection<CartItem> CartItems { get; set; } = new List<CartItem>();
   
    public virtual ICollection<CompareItem> CompareItems { get; set; } = new List<CompareItem>();

    public virtual ICollection<WishlistItem> WishlistItems { get; set; } = new List<WishlistItem>();
    
    public virtual Category Category { get; set; } = null!;

    public virtual ICollection<OrderItem> OrderItems { get; set; } = new List<OrderItem>();

    public virtual ICollection<ProductImage> ProductImages { get; set; } = new List<ProductImage>();

    public virtual ICollection<ProductsDiscounts> ProductDiscounts { get; set; } = new List<ProductsDiscounts>();

    public ICollection<Review> Reviews { get; set; } = new List<Review>();

}

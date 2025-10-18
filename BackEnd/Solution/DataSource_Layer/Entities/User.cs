using System;
using System.Collections.Generic;
using DataSource.Entities;

namespace DataSource.Entities;

public partial class User
{
    public int Id { get; set; }

    public string FirstName { get; set; } = null!;

    public string LastName { get; set; } = null!;

    public string Email { get; set; } = null!;

    public string Password { get; set; } = null!;

    public string? Address { get; set; }

    public string? PhoneNumber { get; set; }

    public string Role { get; set; } = null!;

    public DateTime CreatedAt { get; set; }

    public bool IsEmailConfirmed { get; set; }

    public virtual ICollection<CartItem> CartItems { get; set; } = new List<CartItem>();
    
    public virtual ICollection<CompareItem> CompareItems { get; set; } = new List<CompareItem>();

    public virtual ICollection<WishlistItem> WishlistItems { get; set; } = new List<WishlistItem>();

    public virtual ICollection<VerificationCode> VerificationCodes { get; set; } = new List<VerificationCode>();

    public virtual ICollection<Order> Orders { get; set; } = new List<Order>();

    public ICollection<Review> Reviews { get; set; } = new List<Review>();


    public virtual UsersPermission? UsersPermission { get; set; }
}

using System;
using System.Collections.Generic;
using DataSource.Entities;
using Microsoft.EntityFrameworkCore;

namespace DataSource.Data;

public partial class AppDbContext : DbContext
{
    public AppDbContext()
    {
    }

    public AppDbContext(DbContextOptions<AppDbContext> options)
        : base(options)
    {
    }
    public virtual DbSet<CartItem> CartItems { get; set; }
    public virtual DbSet<CategoriesDiscount> CategoriesDiscounts { get; set; }

    public virtual DbSet<Category> Categories { get; set; }

    public virtual DbSet<CompareItem> CompareItems { get; set; }

    public virtual DbSet<Discount> Discounts { get; set; }

    public virtual DbSet<EmailVerification> EmailsVerifications { get; set; }

    public virtual DbSet<Order> Orders { get; set; }

    public virtual DbSet<OrderItem> OrderItems { get; set; }

    public virtual DbSet<OrderStatus> OrderStatuses { get; set; }

    public virtual DbSet<Product> Products { get; set; }

    public DbSet<vw_Product> ProductsView { get; set; }
    public DbSet<vw_AdminProduct> ProductsView_Admin { get; set; }

    public DbSet<PasswordResetToken> PasswordResetTokens { get; set; }

    public virtual DbSet<ProductImage> ProductImages { get; set; }

    public virtual DbSet<ProductsDiscounts> ProductsDiscounts { get; set; }

    public virtual DbSet<Review> Reviews { get; set; }

    public virtual DbSet<User> Users { get; set; }

    public virtual DbSet<UsersPermission> UsersPermissions { get; set; }

    public virtual DbSet<WishlistItem> WishlistItems { get; set; }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        => optionsBuilder.UseSqlServer("server=.;database=GamingStore;Trusted_Connection=true;Encrypt=true;TrustServerCertificate=True;");

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.ApplyConfigurationsFromAssembly(typeof(AppDbContext).Assembly);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}

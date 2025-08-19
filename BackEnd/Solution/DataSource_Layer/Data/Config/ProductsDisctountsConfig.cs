
using DataSource.Entities;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Microsoft.EntityFrameworkCore;

namespace DataSource.Data.Config
{
 
    public class ProductsDisctountsConfig : IEntityTypeConfiguration<ProductsDiscounts>
    {
        public void Configure(EntityTypeBuilder<ProductsDiscounts> entity)
        {
            entity.HasKey(e => e.Id).HasName("PK__Products__3214EC2769D502BE");

            entity.HasIndex(e => new { e.ProductId, e.DiscountId }, "UQ_Product_Discount").IsUnique();

            entity.Property(e => e.Id).HasColumnName("ID");
            entity.Property(e => e.DiscountId).HasColumnName("DiscountID");
            entity.Property(e => e.ProductId).HasColumnName("ProductID");

            entity.HasOne(d => d.Discount).WithMany(p => p.ProductsDiscounts)
                .HasForeignKey(d => d.DiscountId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__ProductsD__Disco__14270015");

            entity.HasOne(d => d.Product).WithMany(p => p.ProductDiscounts)
                .HasForeignKey(d => d.ProductId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__ProductsD__Produ__1332DBDC");
        }
    }
}

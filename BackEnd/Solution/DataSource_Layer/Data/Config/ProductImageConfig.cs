
using DataSource.Entities;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Microsoft.EntityFrameworkCore;

namespace DataSource.Data.Config
{
    public class ProductImageConfig : IEntityTypeConfiguration<ProductImage>
    {
        public void Configure(EntityTypeBuilder<ProductImage> entity)
        {
            entity.HasKey(e => e.Id).HasName("PK__ProductI__3214EC07B65128A1");

            entity.Property(e => e.ImageUrl).HasMaxLength(255);
            entity.Property(e => e.IsMain).HasDefaultValue(false);

            entity.HasOne(d => d.Product).WithMany(p => p.ProductImages)
                .HasForeignKey(d => d.ProductId)
                .HasConstraintName("FK__ProductIm__Produ__440B1D61");
        }
    }

}

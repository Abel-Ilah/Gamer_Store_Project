using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using DataSource.Entities;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Microsoft.EntityFrameworkCore;

namespace DataSource.Data.Config
{
    public class WishlistItemConfig: IEntityTypeConfiguration<WishlistItem>
    {
        public void Configure(EntityTypeBuilder<WishlistItem> entity)
        {
            entity.HasKey(e => e.Id).HasName("PK__Wishlist__3213E83F709AD295");

            entity.HasIndex(e => new { e.UserId, e.ProductId }, "UQ_User_Product_Wishlist").IsUnique();

            entity.Property(e => e.Id).HasColumnName("id");

            entity.HasOne(d => d.Product).WithMany(p => p.WishlistItems)
                .HasForeignKey(d => d.ProductId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__WishlistI__Produ__54CB950F");

            entity.HasOne(d => d.User).WithMany(p => p.WishlistItems)
                .HasForeignKey(d => d.UserId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__WishlistI__UserI__53D770D6");
        }
    }
}

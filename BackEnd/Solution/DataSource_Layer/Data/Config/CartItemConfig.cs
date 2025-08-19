using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using DataSource.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace DataSource.Data.Config
{
    public class CartItemConfig: IEntityTypeConfiguration<CartItem>
    {
        public void Configure(EntityTypeBuilder<CartItem> entity)
        {
            entity.HasKey(e => e.Id).HasName("PK__CartItem__3214EC07996E346D");

            entity.HasIndex(e => new { e.UserId, e.ProductId }, "UQ_User_Product_Cart").IsUnique();

            entity.HasOne(d => d.Product).WithMany(p => p.CartItems)
                .HasForeignKey(d => d.ProductId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__CartItems__Produ__5B78929E");

            entity.HasOne(d => d.User).WithMany(p => p.CartItems)
                .HasForeignKey(d => d.UserId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__CartItems__UserI__5A846E65");
        }
    }
}

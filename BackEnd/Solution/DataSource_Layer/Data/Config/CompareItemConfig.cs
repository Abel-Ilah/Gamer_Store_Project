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
 
    public class CompareItemConfig : IEntityTypeConfiguration<CompareItem>
    {
        public void Configure(EntityTypeBuilder<CompareItem> entity)
        {
            entity.HasKey(e => e.Id).HasName("PK__CompareI__3214EC07AC09D856");

            entity.HasIndex(e => new { e.UserId, e.ProductId }, "UQ_User_Product_Compare").IsUnique();

            entity.HasOne(d => d.Product).WithMany(p => p.CompareItems)
                .HasForeignKey(d => d.ProductId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__CompareIt__Produ__603D47BB");

            entity.HasOne(d => d.User).WithMany(p => p.CompareItems)
                .HasForeignKey(d => d.UserId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__CompareIt__UserI__5F492382");
        }
    }
}

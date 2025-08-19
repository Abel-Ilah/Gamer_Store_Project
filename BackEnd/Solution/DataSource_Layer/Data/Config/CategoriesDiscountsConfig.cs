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
    public class CategoriesDiscountsConfig:IEntityTypeConfiguration<CategoriesDiscount>
    {
        public void Configure(EntityTypeBuilder<CategoriesDiscount> entity)
        {
            entity.HasKey(e => e.Id).HasName("PK__Categori__3214EC27811A6A7B");

            entity.HasIndex(e => new { e.CategoryId, e.DiscountId }, "UQ_Category_Discount").IsUnique();

            entity.Property(e => e.Id).HasColumnName("ID");
            entity.Property(e => e.CategoryId).HasColumnName("CategoryID");
            entity.Property(e => e.DiscountId).HasColumnName("DiscountID");

            entity.HasOne(d => d.Category).WithMany(p => p.CategoriesDiscounts)
                .HasForeignKey(d => d.CategoryId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__Categorie__Categ__19DFD96B");

            entity.HasOne(d => d.Discount).WithMany(p => p.CategoriesDiscounts)
                .HasForeignKey(d => d.DiscountId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__Categorie__Disco__1AD3FDA4");
        }
    }
}

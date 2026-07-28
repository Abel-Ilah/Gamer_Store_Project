using System;
using DataSource.Entities;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Microsoft.EntityFrameworkCore;

namespace DataSource.Data.Config
{
    public class CategoryConfig : IEntityTypeConfiguration<Category>
    {
        public void Configure(EntityTypeBuilder<Category> entity)
        {
            entity.HasKey(e => e.Id).HasName("PK__Categori__3214EC07FCEB0320");

            entity.Property(e => e.ImagePath).HasColumnName("imagePath");
            entity.Property(e => e.Name).HasMaxLength(100);
            entity.Property(e=>e.IsFeatured).HasDefaultValue(false);
        }
    }

}

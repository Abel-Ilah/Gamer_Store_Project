using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection.Emit;
using System.Text;
using System.Threading.Tasks;
using DataSource.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace DataSource.Data.Config
{
    public class DiscountConfig : IEntityTypeConfiguration<Discount>
    {
        public void Configure(EntityTypeBuilder<Discount> entity)
        {
            entity.HasKey(e => e.Id).HasName("PK__Discount__3214EC07875E385D");
            entity.Property(e => e.IsActive).HasDefaultValue(true);
            entity.Property(e => e.Name).HasMaxLength(255);
            entity.Property(e => e.Value).HasColumnType("decimal(5, 2)");
        }
    }

}

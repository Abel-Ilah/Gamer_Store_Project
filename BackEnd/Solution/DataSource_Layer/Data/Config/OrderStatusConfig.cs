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
    public class OrderStatusConfig : IEntityTypeConfiguration<OrderStatus>
    {
        public void Configure(EntityTypeBuilder<OrderStatus> entity)
        {
            entity.HasKey(e => e.Id).HasName("PK__OrderSta__3683B531DAC4D324");

            entity.ToTable("OrderStatus");

            entity.HasIndex(e => e.Name, "UQ__OrderSta__501B3753D22C7EAC").IsUnique();

            entity.Property(e => e.Id).HasColumnName("id");
          
            entity.Property(e => e.Name)
                .HasMaxLength(50)
                .HasColumnName("name");
        }
    }

}

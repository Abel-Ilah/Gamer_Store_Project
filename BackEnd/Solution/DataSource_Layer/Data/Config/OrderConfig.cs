
using DataSource.Entities;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Microsoft.EntityFrameworkCore;

namespace DataSource.Data.Config
{
    public class OrderConfig : IEntityTypeConfiguration<Order>
    {
        public void Configure(EntityTypeBuilder<Order> entity)
        {
            entity.HasKey(e => e.Id).HasName("PK__Orders__3214EC07867D11B7");

            entity.Property(e => e.Id)
                .IsRequired()
                .HasDefaultValueSql("(newid())");

            entity.Property(e => e.Address)
                .IsUnicode(false)
                .HasDefaultValue("");

            entity.Property(e => e.Email)
                .HasMaxLength(100)
                .IsUnicode(false)
                .IsRequired(false);

            entity.Property(e => e.FullName)
                .HasMaxLength(255)
                .IsUnicode(false)
                .HasDefaultValue("");

            entity.Property(e => e.OrderDate)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");

            entity.Property(e => e.StatusId)
                .HasDefaultValue(1)
                .HasColumnName("statusId");

            entity.Property(e => e.TotalAmount)
                .HasColumnType("decimal(18, 2)");

          
            entity.Property(e => e.PhoneNumber)
                .HasMaxLength(50) 
                .IsUnicode(false)
                .IsRequired(); 

            entity.HasOne(d => d.Status)
                .WithMany(p => p.Orders)
                .HasForeignKey(d => d.StatusId)
                .HasConstraintName("FK_Orders_OrderStatus");

            entity.HasOne(d => d.User)
                .WithMany(p => p.Orders)
                .HasForeignKey(d => d.UserId)
                .HasConstraintName("FK_Orders_User");
        }

    }

}

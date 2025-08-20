
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Microsoft.EntityFrameworkCore;
using DataSource.Entities;

namespace DataSource.Data.Config
{
    public class ReviewConfig
    {
        
            public void Configure(EntityTypeBuilder<Review> entity)
            {
               
                entity.HasKey(e => e.Id)
                      .HasName("PK__Reviews__3214EC07");

               
                entity.Property(e => e.Rating)
                      .HasDefaultValue(5);

               
                entity.Property(e => e.Comment)
                      .HasMaxLength(1000);

                // CreatedAt default value
                entity.Property(e => e.CreatedAt)
                      .HasDefaultValueSql("GETDATE()");

                // Relationships
                entity.HasOne(d => d.Product)
                      .WithMany(p => p.Reviews)
                      .HasForeignKey(d => d.ProductId)
                      .OnDelete(DeleteBehavior.ClientSetNull)
                      .HasConstraintName("FK_Reviews_Products");

                entity.HasOne(d => d.User)
                      .WithMany(u => u.Reviews)
                      .HasForeignKey(d => d.UserId)
                      .OnDelete(DeleteBehavior.ClientSetNull)
                      .HasConstraintName("FK_Reviews_Users");
            }
        }
    }


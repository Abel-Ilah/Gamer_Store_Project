using DataSource.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

public class AdminConfig : IEntityTypeConfiguration<Admin>
{
    public void Configure(EntityTypeBuilder<Admin> entity)
    {
        entity.HasKey(e => e.Id)
            .HasName("PK__Admins__3214EC07");

        entity.HasIndex(e => e.UserName)
            .IsUnique()
            .HasDatabaseName("UQ_Admins_UserName");

        entity.Property(e => e.UserName)
            .HasMaxLength(50)
            .IsRequired();

        entity.Property(e => e.Name)
            .HasMaxLength(100)
            .IsRequired();

        entity.Property(e => e.PasswordHash)
            .HasMaxLength(500)
            .IsRequired();

        entity.Property(e => e.IsActive)
            .HasDefaultValue(true);

        entity.Property(e => e.CreatedAt)
            .HasDefaultValueSql("(getutcdate())");

        entity.Property(e => e.LastLoginAt)
            .IsRequired(false);
    }
}
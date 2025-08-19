
using DataSource.Entities;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Microsoft.EntityFrameworkCore;

namespace DataSource.Data.Config
{
   
    public class EmailConfirmationCodeConfig : IEntityTypeConfiguration<EmailConfirmationCode>
    {
        public void Configure(EntityTypeBuilder<EmailConfirmationCode> entity)
        {
            entity.HasKey(e => e.Id).HasName("PK__EmailCon__3214EC07EB6512C3");

            entity.HasIndex(e => new { e.UserId, e.IsUsed, e.ExpiresAt }, "IX_EmailCode_User_Active");

            entity.HasIndex(e => e.UserId, "UX_EmailCode_UniquePerUser")
                .IsUnique()
                .HasFilter("([IsUsed] = 0)");

            entity.Property(e => e.Code)
                .HasMaxLength(6)
                .IsUnicode(false);

            entity.Property(e => e.CreatedAt)
                .HasDefaultValueSql("(getutcdate())")
                .HasColumnType("datetime");

            entity.Property(e => e.ExpiresAt)
                .HasColumnType("datetime");

           
            entity.HasOne(d => d.User)
                .WithMany(p => p.EmailConfirmationCodes) 
                .HasForeignKey(d => d.UserId)
                .HasConstraintName("FK_EmailConfirmationCodes_Users");
        }

    }

}

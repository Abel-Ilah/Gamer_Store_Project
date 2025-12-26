
using DataSource.Entities;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Microsoft.EntityFrameworkCore;

namespace DataSource.Data.Config
{

    using Microsoft.EntityFrameworkCore;
    using Microsoft.EntityFrameworkCore.Metadata.Builders;

    public class EmailVerificationConfig : IEntityTypeConfiguration<EmailVerification>
    {
        public void Configure(EntityTypeBuilder<EmailVerification> entity)
        {
           
            entity.ToTable("EmailsVerifications");

           
            entity.HasKey(e => e.Id)
                  .HasName("PK__EmailCon__3214EC07EB6512C3");

          
            entity.HasIndex(e => new { e.UserId, e.IsUsed, e.ExpiresAt }, "IX_EmailCode_User_Active");

            entity.HasIndex(e => e.UserId, "UX_EmailCode_UniquePerUser")
                  .IsUnique()
                  .HasFilter("([IsUsed] = 0)");

           

            entity.Property(e => e.Code)
                  .HasMaxLength(6)
                  .IsUnicode(false) 
                  .IsRequired();

            entity.Property(e => e.CreatedAt)
                  .HasColumnType("datetime")
                  .HasDefaultValueSql("(getutcdate())")
                  .IsRequired();

            entity.Property(e => e.ExpiresAt)
                  .HasColumnType("datetime")
                  .IsRequired();


            entity.Property(e => e.IsUsed)
                  .HasDefaultValue(false)
                  .IsRequired();

            entity.Property(e => e.UserId)
                  .IsRequired();

           
            entity.HasOne(d => d.User)
                  .WithMany(p => p.VerificationCodes)
                  .HasForeignKey(d => d.UserId)
                  .OnDelete(DeleteBehavior.Cascade)
                  .HasConstraintName("FK_EmailConfirmationCodes_Users");
        }
    }


}

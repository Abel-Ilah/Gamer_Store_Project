
using DataSource.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace DataSource.Data.Config
{
    public class UsersPermissionConfig : IEntityTypeConfiguration<UsersPermission>
    {
        public void Configure(EntityTypeBuilder<UsersPermission> entity)
        {
            entity.HasKey(e => e.Id).HasName("PK__UsersPer__1788CCACAB794867");

            entity.Property(e => e.Id).ValueGeneratedNever();

            entity.HasOne(d => d.User).WithOne(p => p.UsersPermission)
                .HasForeignKey<UsersPermission>(d => d.Id)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__UsersPerm__UserI__778AC167");
        }
    }

}

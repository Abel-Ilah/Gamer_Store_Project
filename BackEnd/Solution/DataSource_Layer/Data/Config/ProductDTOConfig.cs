
using DataSource.DTOs;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Microsoft.EntityFrameworkCore;

namespace DataSource.Data.Config
{
    public class ProductDTOConfig : IEntityTypeConfiguration<ProductDTO>
    {
        public void Configure(EntityTypeBuilder<ProductDTO> entity)
        {
            entity.HasNoKey();              
            entity.ToView(null);          

           
            entity.Property(e => e.Name)
                  .HasMaxLength(255)
                  .IsUnicode(false);

            entity.Property(e => e.ImageUrl)
                  .HasMaxLength(1000)
                  .IsUnicode(false);
        }
    }
}

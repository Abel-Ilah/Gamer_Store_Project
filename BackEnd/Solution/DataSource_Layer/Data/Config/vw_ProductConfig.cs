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
    public class vw_ProductConfig : IEntityTypeConfiguration<vw_Product>
    {
        public void Configure(EntityTypeBuilder<vw_Product> entity)
        {
            entity.ToView("vw_Product");
            entity.HasKey(v=>v.Id);
        }
    }
}

using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using DataSource.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace DataSource.Data.Config
{
    public class vw_AdminProductConfig : IEntityTypeConfiguration<vw_AdminProduct>
    {
        public void Configure(EntityTypeBuilder<vw_AdminProduct> entity)
        {
            entity.ToView("vw_AdminProduct");
            entity.HasKey(v => v.Id);
        }
    }
}

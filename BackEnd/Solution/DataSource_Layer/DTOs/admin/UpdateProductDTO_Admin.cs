using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DataSource.DTOs.admin
{
    public class UpdateProductDTO_Admin:AddProductDTO_Admin
    {
        public int Id { get; set; }
    }
}

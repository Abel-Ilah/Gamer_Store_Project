using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using DataSource.Entities;

namespace DataSource.DTOs.admin
{
  
    public class ProductsDTO_Admin
    {
        public List<vw_AdminProduct> Products { get; set; } = new List<vw_AdminProduct>();

        public int Count { get; set; } = 0;
    }
}

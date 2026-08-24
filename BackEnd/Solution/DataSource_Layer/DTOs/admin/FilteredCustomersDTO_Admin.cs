using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DataSource.DTOs.admin
{
    public class FilteredCustomersDTO_Admin
    {
        public List<CustomerInfoDTO> Customers { get; set; } = new List<CustomerInfoDTO>();

        public int Count { get; set; } = 0;
    }
}

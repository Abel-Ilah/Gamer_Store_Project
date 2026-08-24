using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DataSource.DTOs.admin
{
    public class UpdateMainImageDTO_Admin
    {
        public int? OldMainImageId {  get; set; }
        public int? NewMainImageId { get; set; }
    }
}

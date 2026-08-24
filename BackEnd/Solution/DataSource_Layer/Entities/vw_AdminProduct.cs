using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using DataSource.Classess;

namespace DataSource.Entities
{
    public class vw_AdminProduct:ProductViewBase
    {
        public int Sales { get; set; }
        public bool IsDeleted { get; set; }

    }
}

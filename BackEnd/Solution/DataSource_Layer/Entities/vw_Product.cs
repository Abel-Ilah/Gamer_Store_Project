using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using DataSource.Classess;

namespace DataSource.Entities
{
    public class vw_Product:ProductViewBase
    {
        public DateOnly Date { get; set; }
    }

}

using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DataSource.DTOs
{
    public class NewPsswordDTO
    {
       public int UserId { get; set; }
         
       public string CurrentPassword { get; set; } = string.Empty;

       public string NewPassword { get; set; } = string.Empty;

    }
}

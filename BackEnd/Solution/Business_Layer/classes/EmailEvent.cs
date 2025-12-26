using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Services.classes
{
    public class EmailEvent
    {
        public string Email { get; set; } = null!;
        public string UserType { get; set; } = null!; // verify | reset
        public string Payload { get; set; } = null!;
    }

}

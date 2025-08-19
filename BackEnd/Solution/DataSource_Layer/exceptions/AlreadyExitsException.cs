using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DataSource.exceptions
{
    public class AlreadyExitsException:Exception
    {
        public AlreadyExitsException(string Message)
        :base(Message){ }
    }
}

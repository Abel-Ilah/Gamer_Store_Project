using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DataSource.exceptions
{
    public class VerificationCodeException:Exception
    {
        public VerificationCodeException(string message)
       : base(message) { }
    }
}

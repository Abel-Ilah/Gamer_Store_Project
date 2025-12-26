using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading.Tasks;

namespace Services.classes
{
    public static class Validations
    {
        public static bool IsValidEmailFormat(string email)
        {
            if (string.IsNullOrWhiteSpace(email))
                return false;
            try
            {
                // Use System.Net.Mail.MailAddress to validate email format
                var addr = new System.Net.Mail.MailAddress(email);
                return addr.Address == email;
            }
            catch
            {
                return false;
            }
        }


      
    }
}

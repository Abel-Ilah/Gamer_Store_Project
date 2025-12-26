using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Services.classes;

namespace Services.Interfaces
{
    public interface IEmailNotifier
    {
        Task NotifyAsync(EmailEvent data);
    }
}

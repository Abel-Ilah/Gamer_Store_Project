using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.Extensions.DependencyInjection;
using Services.classes;
using Services.Interfaces;

namespace Services.services
{
    public class EmailVerificationNotifier:IEmailNotifier
    {
        private readonly IEmailListener _listener;

        public EmailVerificationNotifier([FromKeyedServices("verify-email")]IEmailListener listener)
        {
            _listener = listener;
        }

        public async Task NotifyAsync(EmailEvent data)
        {
                await _listener.HandleAsync(data);
        }
    }
}

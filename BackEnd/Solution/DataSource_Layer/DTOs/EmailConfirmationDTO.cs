using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DataSource.DTOs
{
    public class EmailConfirmationDTO
    {
        public int Id { get; set; }

        public int UserId { get; set; }

        public string Code { get; set; } = null!;

        public DateTime CreatedAt { get; set; }

        public DateTime ExpiresAt { get; set; }

        public bool IsUsed { get; set; }
    }
}

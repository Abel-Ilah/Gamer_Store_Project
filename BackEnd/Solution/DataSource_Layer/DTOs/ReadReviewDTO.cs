using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DataSource.DTOs
{
    public class ReadReviewDTO:ReviewDTO
    {
        public CustomerShortDTO User { get; set; } = null!;
    }
}

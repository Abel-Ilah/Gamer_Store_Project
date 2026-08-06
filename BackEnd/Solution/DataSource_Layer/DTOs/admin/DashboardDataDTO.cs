using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DataSource.DTOs.admin
{
    public class DashboardDataDTO
    {
        public DashboardStatisticsDTO Statistics { get; set; } = new DashboardStatisticsDTO();

        public List<TopProductDTO_Admin> TopProducts { get; set; } = new List<TopProductDTO_Admin>();

        public List<LowStockProductDTO_Admin> LowStockProducts { get; set; } = new List<LowStockProductDTO_Admin>();

        public List<OrderDto_Admin> LastOrders { get; set; } = new List<OrderDto_Admin>();

        public List<CustomerBasicDto_Admin> NewCustomers { get; set; } = new List<CustomerBasicDto_Admin>();

        public List<ReviewDTO_Admin> LastReviews { get; set; } = new List<ReviewDTO_Admin>();
    }
}

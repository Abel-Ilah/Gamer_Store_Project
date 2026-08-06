
namespace DataSource.DTOs.admin
{
    public class DashboardStatisticsDTO
    {
        public StatisticsItemDTO_Admin Orders { get; set; } = new StatisticsItemDTO_Admin();
        public StatisticsItemDTO_Admin Customers { get; set; } = new StatisticsItemDTO_Admin();
        public StatisticsItemDTO_Admin Income { get; set; } = new StatisticsItemDTO_Admin();

    }
}

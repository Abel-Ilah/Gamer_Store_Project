using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using DataSource.DTOs.admin;
using DataSource.Repositories;

namespace Services.services
{
    public class DashboardService
    {
        private readonly OrderService _orderService;
        private readonly CustomerService _customerService;
        private readonly ProductService _productService;
        private readonly ReviewService _reviewService;
        
        public DashboardService(OrderService orderService,CustomerService customerService, ProductService productService, ReviewService reviewService)
        {
            _orderService = orderService;
            _customerService = customerService;
            _productService = productService;
            _reviewService = reviewService;
        }

        public async Task<DashboardDataDTO> GetDashboardDataAsync()
        {
            
            var dashboardStatisics = await GetStatisticsAsync();
 
            var topProducts = await _productService.GetTopProductsAsync(1, 5);

            var lowStockProducts = await _productService.GetLowStockProductsAsync(1, 5);

            var lastOrders = await _orderService.GetOrdersAsync(1, 5);

            var newCustomers = await _customerService.GetCustomersAsync(1, 5);

            var lastReviews = await _reviewService.GetRecentReviewsAsync(1, 5);

            return new DashboardDataDTO()
            {
                Statistics = dashboardStatisics,
                TopProducts = topProducts,
                LowStockProducts = lowStockProducts,
                LastOrders = lastOrders,
                NewCustomers = newCustomers,
                LastReviews = lastReviews,
            };

            


        }

        private async Task<DashboardStatisticsDTO> GetStatisticsAsync()
        {
            var now = DateTime.Now;

            // Current month
            var thisMonthFrom = new DateTime(now.Year, now.Month, 1);
            var thisMonthTo = thisMonthFrom.AddMonths(1);

            // Last month
            var lastMonthFrom = thisMonthFrom.AddMonths(-1);
            var lastMonthTo = thisMonthFrom;


            // orders statistics :
            var ordersCountLastMonth = await _orderService.GetOrdersCountAsync(lastMonthFrom, lastMonthTo);
            var ordersCountThisMonth = await _orderService.GetOrdersCountAsync(thisMonthFrom, thisMonthTo);

            // customers statistics :
            var customersCountLastMonth = await _customerService.GetCustomersCountAsync(lastMonthFrom, lastMonthTo);
            var customersCountThisMonth = await _customerService.GetCustomersCountAsync(thisMonthFrom, thisMonthTo);

            // Income statistics :
            var incomeLastMonth = await _orderService.GetTotalIncomeAsync(lastMonthFrom, lastMonthTo);
            var incomeThisMonth = await _orderService.GetTotalIncomeAsync(thisMonthFrom, thisMonthTo);

            return new DashboardStatisticsDTO
            {
                Orders = new StatisticsItemDTO_Admin
                {
                    Count = ordersCountThisMonth,
                    Change = CalculatePercentageChange(ordersCountLastMonth, ordersCountThisMonth)
                },
                Customers = new StatisticsItemDTO_Admin
                {
                    Count = customersCountThisMonth,
                    Change = CalculatePercentageChange(customersCountLastMonth, customersCountThisMonth)
                },
                Income = new StatisticsItemDTO_Admin
                {
                    Count = incomeThisMonth,
                    Change = CalculatePercentageChange((int)incomeLastMonth, (int)incomeThisMonth)
                }

            };

        }

        private float CalculatePercentageChange(int prevCount, int currentCount)
        {

            if (prevCount == currentCount) return 0f; 

            if (prevCount == 0) return currentCount == 0 ? 0f : 100f;

            return MathF.Round(((currentCount - prevCount) * 100f) / prevCount, 2);
        }


    }
}

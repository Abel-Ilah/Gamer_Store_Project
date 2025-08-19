using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using DataSource.DTOs;
using DataSource.Entities;
using DataSource.Repositories;

namespace Services.services
{
    public class OrderService
    {
        private readonly OrderRepository _OrderRepository;

        public  enum Status
        {
            Pending = 1,
            Confirmed = 2,
            Processing = 3,
            Delivered = 4,
            Cancelled = 5,
            Failed = 6,
            Refunded = 7,
            OnHold = 8,
            Returned = 9,
            Completed = 10
        }

        public OrderService(OrderRepository orderRepository)
        {
            _OrderRepository = orderRepository;
        }

        public async Task<Guid> AddOrderAsync(Order order)
        {
         return await   _OrderRepository.AddAsync(order);
        }

        public async Task<Order?> GetOrderByIdAsync(Guid id)
        {
            return await _OrderRepository.GetByIdAsync(id);
        }



    }
}

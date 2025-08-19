using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using DataSource.Entities;
using DataSource.Repositories;

namespace Services.services
{
    public class OrderItemService
    {
        private readonly OrderItemRepository _orderItemRepository;

        public OrderItemService(OrderItemRepository orderItemRepository)
        {
            _orderItemRepository = orderItemRepository;
        }

        public async Task<IEnumerable<OrderItem>> GetAllOrderItemsAsync()
        {
            return await _orderItemRepository.GetAllAsync();
        }

        public async Task<OrderItem?> GetOrderItemByIdAsync(int id)
        {
            return await _orderItemRepository.GetByIdAsync(id);
        }

        public async Task AddOrderItemsAsync(List<OrderItem> items)
        {
            await _orderItemRepository.AddAsync(items);

        }


        public async Task UpdateOrderItemAsync(OrderItem item)
        {

            await _orderItemRepository.UpdateAsync(item);
        }

        public async Task DeleteOrderItemAsync(int id)
        {
            var item = await _orderItemRepository.GetByIdAsync(id);
            if (item == null)
            {
                throw new KeyNotFoundException($"OrderItem with ID {id} not found.");
            }

            await _orderItemRepository.DeleteAsync(item);
        }
    }

}

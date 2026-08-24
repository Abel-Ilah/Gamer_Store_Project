

using DataSource.DTOs;
using DataSource.DTOs.admin;
using DataSource.Entities;
using DataSource.exceptions;
using DataSource.Repositories;
using Microsoft.EntityFrameworkCore;
using Services.classes;
using Services.exceptions;


namespace Services.services
{
    public class CustomerService 
    {
        private readonly CustomerRepository _customerRepository;

        EmailVerificationService _emailVerificationService;

        public CustomerService(CustomerRepository customerRepository, EmailVerificationService emailVerificationService)
        {
            _customerRepository = customerRepository;
            _emailVerificationService = emailVerificationService;

        }

        public async Task<int> AddAsync(AddCustomerDTO userDto)
        {
            if (await _customerRepository.IsEmailExistsAsync(userDto.Email))
                throw new AlreadyExitsException($"Email [{userDto.Email}] is already in use");
            if (!Validations.IsValidEmailFormat(userDto.Email))
                throw new InvalidEmailFormatException("Invalid email format");

            Customer user = new Customer
            {
                FirstName = userDto.FirstName,
                LastName = userDto.LastName,
                Email = userDto.Email,
                Password = userDto.Password,
                PhoneNumber = userDto.PhoneNumber,
                Address = userDto.Address,
            };

            var userId = await _customerRepository.AddAsync(user);

            if (userId > 0)
            {
                await _emailVerificationService.AddAsync(userId, user.Email);
            }
            return userId;
        }

        public async Task<bool> UpdateAsync(CustomerPersonalInfoDTO info)
        {
            return await _customerRepository.UpdatePersonalInfoAsync(info);
        }

        public async Task<bool> ChangePasswordAsync(NewPsswordDTO obj)
        {
            return await _customerRepository.ChangePasswordAsync(obj);
        }

        public async Task<bool> DeleteAsync(int id)
        {
            return await _customerRepository.DeleteAsync(id);
        }

        public async Task<bool> RestoreAsync(int id)
        {
            return await _customerRepository.RestoreAsync(id);
        }

        public async Task<List<CustomerBasicDto_Admin>> GetCustomersAsync(int pageNumber, int pageSize)
        {
            return await _customerRepository.GetCustomersAsync(pageNumber, pageSize);
        }

        public async Task<FilteredCustomersDTO_Admin> FilterCustomersAsync(CustomersFilterDTO_Admin filter)
        {
            return await _customerRepository.FilterCustomersAsync(filter);
        }

        public async Task<int> GetCustomersCountAsync(DateTime from, DateTime to)
        {
            return await _customerRepository.GetCustomersCountAsync(from,to);
        }

    }
}

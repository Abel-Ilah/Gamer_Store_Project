
using System.Security.Cryptography;
using System.Text.RegularExpressions;
using DataSource.DTOs;
using DataSource.DTOs.admin;
using DataSource.Entities;
using DataSource.exceptions;
using DataSource.Repositories;
using Services.classes;
using Services.exceptions;


namespace Services.services
{
    public class CustomerService : UserServiceBase
    {
        protected override string Role => "customer";

        public CustomerService(UserRepository userRepository, EmailVerificationService emailVerificationService)
            : base(userRepository, emailVerificationService)
        {

        }

        public async Task<List<CustomerBasicDto_Admin>> GetCustomersAsync(int pageNumber, int pageSize)
        {
            return await _userRepository.GetCustomersAsync(pageNumber, pageSize);
        }
        public async Task<int> GetCustomersCountAsync(DateTime from, DateTime to)
        {
            return await _userRepository.GetCustomersCountAsync(from,to);
        }
    }
}

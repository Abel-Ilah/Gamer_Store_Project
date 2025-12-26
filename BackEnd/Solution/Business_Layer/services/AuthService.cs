using DataSource.DTOs;
using DataSource.Entities;
using DataSource.Repositories;

namespace Services.services
{
    public class AuthService
    {
        private readonly AuthRepository _authRepository;
        public AuthService(AuthRepository authRepository)
        {
            _authRepository = authRepository;
        }
        public async Task<UserReadDTO?> Login(LoginRequestDTO credentials)
        {
            var user =  await _authRepository.Login(credentials);

            if (user == null)  return null;
            
            return new UserReadDTO()
            {
                Id = user.Id,
                FirstName = user.FirstName,
                LastName = user.LastName,
                Email = user.Email,
                Address = user.Address,
                PhoneNumber = user.PhoneNumber,
                CreatedAt = user.CreatedAt,
                IsEmailConfirmed = user.IsEmailConfirmed,
            };
            
        }
    }
}

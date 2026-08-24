using DataSource.DTOs;
using DataSource.Entities;
using DataSource.Repositories;

namespace Services.services
{
    public class AuthService
    {
        private readonly AuthRepository _authRepository;
        private readonly EmailVerificationService _emailVerificationService;
        private readonly ResetPasswordService _resetPasswordService;
        public AuthService(AuthRepository authRepository, EmailVerificationService emailVerificationService, ResetPasswordService resetPasswordService)
        {
            _authRepository = authRepository;
            _emailVerificationService = emailVerificationService;
            _resetPasswordService = resetPasswordService;
        }
        public async Task<CustomerInfoDTO?> Login(LoginRequestDTO credentials)
        {
            var user = await _authRepository.CustomerLogin(credentials);

            if (user == null) return null;

            return new CustomerInfoDTO()
            {
                Id = user.Id,
                FirstName = user.FirstName,
                LastName = user.LastName,
                Email = user.Email,
                Address = user.Address != null ? user.Address : "",
                PhoneNumber = user.PhoneNumber != null ? user.PhoneNumber : "",
                CreatedAt = user.CreatedAt,
                IsEmailConfirmed = user.IsEmailConfirmed,
            };

        }

        // email verification : 
        public async Task<int> AddNewEmailVerificationRequestAsync(int userId, string email)
        {
            return await _emailVerificationService.AddAsync(userId, email);
        }

        public async Task<bool> VerifyEmailAsync(int userId, string code)
        {
            return await _emailVerificationService.VerifyAsync(userId, code);
        }


        // change password : 
        public async Task<bool> AddResetPasswordRequestAsync(string email)
        {
            return await _resetPasswordService.AddRequestAsync(email);
        }
        public async Task<bool> SetNewPasswordAsync(string password, string token)
        {
            return await _resetPasswordService.SetNewPasswordAsync(password, token);
        }

    }
}

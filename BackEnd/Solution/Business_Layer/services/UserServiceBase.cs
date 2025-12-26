using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using DataSource.DTOs; 
using DataSource.Entities;
using DataSource.exceptions;
using DataSource.Repositories;
using Services.classes;
using Services.exceptions;

namespace Services.services
{
    public abstract class UserServiceBase
    {
        protected readonly UserRepository _userRepository;
        private readonly EmailVerificationService _emailVerificationService ;

        protected  abstract string Role { get; }

        protected UserServiceBase( UserRepository userRepository, EmailVerificationService emailVerificationService)
        {
            _userRepository = userRepository;
            _emailVerificationService = emailVerificationService;
        }

        public async Task<UserReadDTO?> FindAsync(int id)
        {
            var user = await _userRepository.GetByIdAsync(id);
            if (user == null) return null;

            return new UserReadDTO
            {
                Id = user.Id,
                FirstName = user.FirstName,
                LastName = user.LastName,
                Email = user.Email,
                PhoneNumber = user.PhoneNumber,
                Address = user.Address,
                IsEmailConfirmed = user.IsEmailConfirmed,
               
                CreatedAt = user.CreatedAt
            };
        }

        public async Task<int> GetIdAsync(string email)
        {
            if (!Validations.IsValidEmailFormat(email))
                throw new InvalidEmailFormatException("Invalid email format.");

            return await _userRepository.GetUserId(email, Role);
        }

        public async Task<int> AddAsync(UserWriteDTO userDto)
        {
            if (await _userRepository.IsEmailExistsAsync(userDto.Email))
                throw new AlreadyExitsException($"Email [{userDto.Email}] is already in use");
            if(!Validations.IsValidEmailFormat(userDto.Email))
                throw new InvalidEmailFormatException("Invalid email format");

            User user = new User
            {
                FirstName = userDto.FirstName,
                LastName = userDto.LastName,
                Email = userDto.Email,
                Password = userDto.Password,
                PhoneNumber = userDto.PhoneNumber,
                Address = userDto.Address,
                Role = Role
            };

            var userId = await _userRepository.AddAsync(user);

           if(userId > 0)
           {
                await _emailVerificationService.AddAsync(userId,user.Email);
           }
            return userId;
        }


    }

}

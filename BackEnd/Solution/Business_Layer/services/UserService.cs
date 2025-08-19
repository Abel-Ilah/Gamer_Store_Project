
using DataSource.Entities;
using DataSource.Repositories;
using DataSource.exceptions;

namespace Services.services
{
    public class UserService
    {
        private readonly UserRepository _userRepository;

        public UserService(UserRepository userRepository)
        {
            _userRepository = userRepository;
        }

        public async Task<IEnumerable<User>> GetAllUsersAsync()
        {
            return await _userRepository.GetAllCustomersAsync();
        }

        public async Task<User?> GetUserByIdAsync(int id)
        {
            return await _userRepository.GetByIdAsync(id);
        }

        public async Task<User?> GetUserByLoginInfo(string email, string password)
        {
            return await _userRepository.GetUserByLoginInfo(email, password);
        }
        public async Task<int> AddUserAsync(User user)
        {
            if (await _userRepository.IsEmailExistsAsync(user.Email))
            {
                throw new AlreadyExitsException($"Email [{user.Email}] is already in use.");
            }
            else 
            return await _userRepository.AddAsync(user);
        }

        public async Task<bool> UpdateUserAsync(User user)
        {
            return await _userRepository.UpdateAsync(user);
        }

        public async Task<bool> DeleteUserAsync(User user)
        {
           
            return await _userRepository.DeleteAsync(user);
        }

        public async Task<bool> DeleteUserByIdAsync(int id)
        {
            var userToDelete = await _userRepository.GetByIdAsync(id);
            if (userToDelete == null)
            {
                return false;
            }
            return await _userRepository.DeleteAsync(userToDelete);
        }
    }
}

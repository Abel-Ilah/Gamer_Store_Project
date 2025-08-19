using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using DataSource.Entities;
using DataSource.Repositories;

namespace Services.services
{
    public class UserPermissionsService
    {
        private readonly UserPermissionsRepository _userPermissionsRepository;

        public UserPermissionsService(UserPermissionsRepository userPermissionsRepository)
        {
            _userPermissionsRepository = userPermissionsRepository;
        }

        public async Task<IEnumerable<UsersPermission>> GetAllUserPermissionsAsync()
        {
            return await _userPermissionsRepository.GetAllAsync();
        }

        public async Task<UsersPermission?> GetUserPermissionsByIdAsync(int id)
        {
            return await _userPermissionsRepository.GetByIdAsync(id);
        }

        public async Task<int> AddUserPermissionsAsync(UsersPermission userPermissions)
        {
            // Add any business logic or validation related to adding user permissions here
            return await _userPermissionsRepository.AddAsync(userPermissions);
        }

        public async Task<bool> UpdateUserPermissionsAsync(UsersPermission userPermissions)
        {
            // Add any business logic or validation related to updating user permissions here
            return await _userPermissionsRepository.UpdateAsync(userPermissions);
        }

        public async Task<bool> DeleteUserPermissionsAsync(UsersPermission userPermissions)
        {
            // Add any business logic or validation related to deleting user permissions here
            return await _userPermissionsRepository.DeleteAsync(userPermissions);
        }

        public async Task<bool> DeleteUserPermissionsByIdAsync(int id)
        {
            var permissionsToDelete = await _userPermissionsRepository.GetByIdAsync(id);
            if (permissionsToDelete == null)
            {
                return false; // User permissions not found
            }
            return await _userPermissionsRepository.DeleteAsync(permissionsToDelete);
        }
    }
}

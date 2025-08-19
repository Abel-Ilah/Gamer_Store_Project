using DataSource.Entities;

namespace DataSource.DTOs
{

    public class UserReadDTO {
        public int Id { get; set; }
        public string FirstName { get; set; } = null!;
        public string LastName { get; set; } = null!;
        public string Email { get; set; } = null!;
        public string? PhoneNumber { get; set; }
        public string? Address { get; set; }
        public bool IsEmailConfirmed { get; set; }

    }
    public class UserWriteDTO
    {
        public int Id { get; set; }

        public string FirstName { get; set; } = null!;

        public string LastName { get; set; } = null!;

        public string Email { get; set; } = null!;

        public string Password { get; set; } = null!;

        public string? PhoneNumber { get; set; }

        public string? Address { get; set; } = null!;
        
        public bool IsEmailConfirmed { get; set; }
    }
    public  class AdminReadDTO:UserReadDTO {}
    public  class AdminWriteDTO:UserWriteDTO
    { public byte Permissions { get; set; } }
}

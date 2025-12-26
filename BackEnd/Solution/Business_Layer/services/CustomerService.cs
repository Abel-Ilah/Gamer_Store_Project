
using DataSource.Entities;
using DataSource.Repositories;
using DataSource.exceptions;
using DataSource.DTOs;
using System.Security.Cryptography;
using System.Text.RegularExpressions;
using Services.exceptions;
using Services.classes;


namespace Services.services
{
    public class CustomerService:UserServiceBase
    {
        protected  override string Role => "customer";
         
        public CustomerService(UserRepository userRepository, EmailVerificationService emailVerificationService)
            : base(userRepository, emailVerificationService)
        { 
           
        }


    }
}

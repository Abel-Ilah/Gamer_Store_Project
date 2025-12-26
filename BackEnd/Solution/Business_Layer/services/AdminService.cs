using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Cryptography;
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
    public class AdminService:UserServiceBase
    {
        
        protected override string  Role => "admin";


        public AdminService(UserRepository userRepository, EmailVerificationService emailVerificationService)
             : base(userRepository, emailVerificationService)
        {

        }



    }
}

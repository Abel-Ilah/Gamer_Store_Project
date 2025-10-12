using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using DataSource.Entities;

namespace DataSource.DTOs
{
    public class HeroSectionProducts
    {
        public vw_Product? BestSeller { get; set; }
        public vw_Product? New { get; set; }
        public vw_Product? Trending { get; set; }
        public vw_Product? TopRated { get; set; }
        public vw_Product? Discounted { get; set; }
    }
}

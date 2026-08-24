using System;
using System.Collections.Generic;

namespace DataSource.Entities;

public partial class UsersPermission
{
    public int Id { get; set; }

    public byte Permissions { get; set; }

    public virtual Customer User { get; set; } = null!;
}

using Hie.DB.Common;
using System;
using System.Collections.Generic;

namespace Hie.DB.Entities {
  public class User: IEntity {
    public long Id { get; set; }
    public string Login { get; set; }
    public string PasswordHash { get; set; }
    public string TimeZone { get; set; }
    public string Email { get; set; }
    public DateTime? DateApproveEmailUtc { get; set; }
    public string Phone { get; set; }
    public DateTime? DateApprovePhoneUtc { get; set; }

    public Benefactor Benefactor { get; set; }
    public Client Client { get; set; }

    public ICollection<Follow> Followers { get; set; }
    public ICollection<Follow> Followeds { get; set; }

    public User() {
      Followers = new List<Follow>();
      Followeds = new List<Follow>();
    }
  }
}
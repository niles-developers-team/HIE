using Hie.DB.Common;
using System;
using System.Collections.Generic;

namespace Hie.DB.Entities {
  public class Client: IEntity {
    public long Id { get; set; }
    public DateTime? DateApprovedUtc { get; set; }

    public string INN { get; set; }
    public string Kpp { get; set; }
    public string Ogrn { get; set; }
    public string PersonalBankAccount { get; set; }

    public User User { get; set; }

    public ICollection<Request> Requests { get; set; }

    public Client() {
      Requests = new List<Request>();
    }
  }
}
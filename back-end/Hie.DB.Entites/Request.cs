using Hie.DB.Common;
using System;
using System.Collections.Generic;

namespace Hie.DB.Entities {
  public class Request: IEntity, ICreatedDate {
    public long Id { get; set; }
    public decimal TotalAmount { get; set; }
    public decimal Amount { get; set; }
    public string Description { get; set; }
    public int RequestStatus { get; set; }
    public int RequestPriority { get; set; }
    public DateTime DeadlineDateUtc { get; set; }
    public DateTime CreateDateUtc { get; set; }

    public long ClientId { get; set; }
    public Client Client { get; set; }

    public ICollection<RequestComment> Comments { get; set; }

    public Request() {
      Comments = new List<RequestComment>();
    }
  }
}
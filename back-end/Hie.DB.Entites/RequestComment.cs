using Hie.DB.Common;
using System;

namespace Hie.DB.Entities {
  public class RequestComment: IEntity, ICreatedDate {
    public long Id { get; set; }
    public DateTime CreateDateUtc { get; set; }
    public string Text { get; set; }

    public long UserId { get; set; }
    public User User { get; set; }

    public long? ParentId { get; set; }
    public RequestComment Parent { get; set; }

    public long RequestId { get; set; }
    public Request Request { get; set; }
  }
}
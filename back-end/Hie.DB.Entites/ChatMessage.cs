using Hie.DB.Common;
using System;

namespace Hie.DB.Entities {
  public class ChatMessage : IEntity, ICreatedDate {
    public long Id { get; set; }
    public DateTime CreateDateUtc { get; set; }
    public string Text { get; set; }

    public long SenderId { get; set; }
    public User Sender { get; set; }

    public long RecepientId { get; set; }
    public User Recepient { get; set; }

    public long? RequestId { get; set; }
    public Request Request { get; set; }
  }
}
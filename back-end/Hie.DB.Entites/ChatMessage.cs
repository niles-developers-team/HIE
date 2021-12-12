using Hie.DB.Common;
using System;

namespace Hie.DB.Entities {
  public class ChatMessage : IEntity, ICreatedDate {
    public long Id { get; set; }
    public DateTime CreateDateUtc { get; set; }
    public string Text { get; set; }

    public long BenefactorId { get; set; }
    public Benefactor Benefactor { get; set; }

    public long RequestId { get; set; }
    public Request Request { get; set; }

    public long ClientId { get; set; }
    public Client Client { get; set; }
  }
}
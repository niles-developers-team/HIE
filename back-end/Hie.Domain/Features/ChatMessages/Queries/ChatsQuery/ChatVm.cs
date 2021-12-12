using System;

namespace Hie.Domain.Features.ChatMessages.Queries.ChatsQuery {
  public class ChatVm {
    public long MessageId { get; set; }
    public long? RecepientId { get; set; }
    public string RecepientLogin { get; set; }
    public long? RequestId { get; set; }

    public LastMessageVm LastMessage { get; set; }
  }

  public class LastMessageVm {
    public DateTime CreateDate { get; set; }
    public string Text { get; set; }
  }
}
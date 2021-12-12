using Hie.DB.Common;
using System;
using System.Collections.Generic;

namespace Hie.DB.Entities {
  public class Benefactor: IEntity {
    public long Id { get; set; }
    public decimal TotalAmount { get; set; }
    public bool AlwaysPayComission { get; set; }

    public User User { get; set; }

    public long LevelId { get; set; }
    public BenefactorLevel Level { get; set; }

    public ICollection<ChatMessage> ChatMessages { get; set; }

    public Benefactor() {
      ChatMessages = new List<ChatMessage>();
    }
  }
}
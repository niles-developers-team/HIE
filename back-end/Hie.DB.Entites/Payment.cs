using Hie.DB.Common;
using System;

namespace Hie.DB.Entities {
  public class Payment: IEntity, ICreatedDate {
    public long Id { get; set; }
    public DateTime CreateDateUtc { get; set; }
    public decimal Amount { get; set; }
    public string Comment { get; set; }

    public long BenefactorId { get; set; }
    public Benefactor Benefactor { get; set; }

    public long? RequestId { get; set; }
    public Request Request { get; set; }
  }
}
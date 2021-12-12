using Hie.DB.Common;
using System;

namespace Hie.DB.Entities {
  public class AutoPaymentBenefactor: IEntity, ICreatedDate {
    public long Id { get; set; }
    public DateTime CreateDateUtc { get; set; }
    public DateTime? LastDateUtc { get; set; }
    public DateTime? CancelDateUtc { get; set; }
    public decimal Amount { get; set; }
    public int PeriodDays { get; set; }

    public long? ClientId { get; set; }
    public Client Client { get; set; }

    public long BenefactorId { get; set; }
    public Benefactor Benefactor { get; set; }
  }
}
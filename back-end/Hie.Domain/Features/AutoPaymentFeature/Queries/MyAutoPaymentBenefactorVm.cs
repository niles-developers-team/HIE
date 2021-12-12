using Hie.DB.Entities;
using Hie.Domain.Mappings;
using System;

namespace Hie.Domain.Features.AutoPaymentFeature.Queries {
  public class MyAutoPaymentBenefactorVm : IMapFrom<AutoPaymentBenefactor> {
    public long Id { get; set; }
    public DateTime CreateDate { get; set; }
    public DateTime? LastDate { get; set; }
    public bool IsCancel { get; set; }
    public decimal Amount { get; set; }
    public int PeriodDays { get; set; }

    public long? ClientId { get; set; }
    public string ClientName { get; set; }

    public long BenefactorId { get; set; }

    public void Mapping(AutoMapper.Profile profile) {
      profile.CreateMap<AutoPaymentBenefactor, MyAutoPaymentBenefactorVm>()
        .ForMember(d => d.ClientName, opt => opt.MapFrom(s => s.ClientId.HasValue ? s.Client.User.Login : "Наш фонд" ))
        .ForMember(d => d.LastDate, opt => opt.MapFrom(s => s.LastDateUtc))
        .ForMember(d => d.CreateDate, opt => opt.MapFrom(s => s.CreateDateUtc))
        .ForMember(d => d.IsCancel, opt => opt.MapFrom(s => s.CancelDateUtc.HasValue));
    }
  }
}
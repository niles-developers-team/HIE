using Hie.DB.Entities;
using Hie.Domain.Enums;
using Hie.Domain.Mappings;
using System;

namespace Hie.Domain.Features.Requests.Queries.BenefactorRequest {
  public class BenefactorRequestVm : IMapFrom<Request> {
    public long Id { get; set; }
    public decimal TotalAmount { get; set; }
    public decimal Amount { get; set; }
    public string Description { get; set; }
    public RequestStatus RequestStatus { get; set; }
    public string RequestStatusName { get; set; }
    public RequestPriority RequestPriority { get; set; }
    public string RequestPriorityName { get; set; }
    public DateTime DeadlineDate { get; set; }
    public DateTime CreateDate { get; set; }

    public long? ClientId { get; set; }
    public string ClientName { get; set; }

    public void Mapping(AutoMapper.Profile profile) {
      profile.CreateMap<Request, BenefactorRequestVm>()
        .ForMember(d => d.ClientName, opt => opt.MapFrom(s => s.Client.User.Login))
        .ForMember(d => d.DeadlineDate, opt => opt.MapFrom(s => s.DeadlineDateUtc))
        .ForMember(d => d.CreateDate, opt => opt.MapFrom(s => s.CreateDateUtc))
        .ForMember(d => d.RequestStatus, act => act.MapFrom(src => (RequestStatus)src.RequestStatus))
        .ForMember(d => d.RequestPriority, act => act.MapFrom(src => (RequestPriority)src.RequestPriority));
    }
  }
}
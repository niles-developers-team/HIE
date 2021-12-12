using Hie.DB.Entities;
using Hie.Domain.Mappings;
using System;

namespace Hie.Domain.Features.ChatMessages.Queries.DetailChat {
  public class ChatMessageVm : IMapFrom<ChatMessage> {
    public long Id { get; set; }
    public DateTime CreateDate { get; set; }
    public string Text { get; set; }
    public long SenderId { get; set; }
    public string SenderLogin { get; set; }
    public long RecepientId { get; set; }
    public string RecepientLogin { get; set; }
    public long? RequestId { get; set; }

    public void Mapping(AutoMapper.Profile profile) {
      profile.CreateMap<ChatMessage, ChatMessageVm>()
        .ForMember(d => d.CreateDate, opt => opt.MapFrom(s => s.CreateDateUtc))
        .ForMember(d => d.SenderLogin, opt => opt.MapFrom(s => s.Sender.Login))
        .ForMember(d => d.RecepientLogin, opt => opt.MapFrom(s => s.Recepient.Login));
    }
  }
}
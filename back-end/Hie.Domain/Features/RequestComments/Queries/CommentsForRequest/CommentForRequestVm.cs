using Hie.DB.Entities;
using Hie.Domain.Enums;
using Hie.Domain.Mappings;
using System;

namespace Hie.Domain.Features.RequestComments.Queries.CommentsForRequest {
  public class CommentForRequestVm : IMapFrom<RequestComment> {
    public long Id { get; set; }
    public DateTime CreateDate { get; set; }
    public string Text { get; set; }

    public long? ParentId { get; set; }
    public long? RequestId { get; set; }

    public void Mapping(AutoMapper.Profile profile) {
      profile.CreateMap<RequestComment, CommentForRequestVm>()
        .ForMember(d => d.CreateDate, opt => opt.MapFrom(s => s.CreateDateUtc));
    }
  }
}
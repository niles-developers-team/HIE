using Hie.DB.Entities;
using Hie.Domain.Mappings;

namespace Hie.Domain.Features.Profile.Queries.SearchUser {
  public class SearchUserVm: IMapFrom<User> {
    public long Id { get; set; }
    public string Login { get; set; }
    public string Email { get; set; }
    public bool IsClient { get; set; }
    public bool IsBenefactor { get; set; }
    public string Roles { get; set; }
    public void Mapping(AutoMapper.Profile profile) {
      profile.CreateMap<User, SearchUserVm>()
        .ForMember(d => d.IsClient, opt => opt.MapFrom(s => s.Client != null))
        .ForMember(d => d.IsBenefactor, opt => opt.MapFrom(s => s.Benefactor != null));
    }
  }
}
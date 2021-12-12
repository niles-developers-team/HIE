using Hie.DB.Entities;
using Hie.Domain.Mappings;

namespace Hie.Domain.Features.Profile.Command.SignInCommand.ViewModels {
  public class UserVm: IMapFrom<User> {
    public long Id { get; set; }
    public string Login { get; set; }
    public string TimeZone { get; set; }
    public string Email { get; set; }
    public bool IsApproveEmail { get; set; }
    public string Phone { get; set; }
    public bool IsApprovePhone { get; set; }

    public int FollowersCount { get; set; }
    public int FollowedsCount { get; set; }

    public string Token { get; set; }

    public BenefactorVm Benefactor { get; set; }
    public ClientVm Client { get; set; }

    public void Mapping(AutoMapper.Profile profile) {
      profile.CreateMap<User, UserVm>()
        .ForMember(d => d.Benefactor, opt => opt.MapFrom(s => s.Benefactor))
        .ForMember(d => d.Client, opt => opt.MapFrom(s => s.Client))
        .ForMember(d => d.IsApproveEmail, opt => opt.MapFrom(s => s.DateApproveEmailUtc.HasValue))
        .ForMember(d => d.IsApprovePhone, opt => opt.MapFrom(s => s.DateApprovePhoneUtc.HasValue))
        .ForMember(d => d.FollowersCount, opt => opt.MapFrom(s => s.Followers.Count))
        .ForMember(d => d.FollowedsCount, opt => opt.MapFrom(s => s.Followeds.Count));
    }
  }
}
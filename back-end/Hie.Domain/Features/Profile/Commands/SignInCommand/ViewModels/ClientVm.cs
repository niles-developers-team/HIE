using Hie.DB.Entities;
using Hie.Domain.Mappings;

namespace Hie.Domain.Features.Profile.Command.SignInCommand.ViewModels {
  public class ClientVm: IMapFrom<Client> {
    public bool IsApproved { get; set; }

    public string INN { get; set; }
    public string Kpp { get; set; }
    public string Ogrn { get; set; }
    public string PersonalBankAccount { get; set; }

    public void Mapping(AutoMapper.Profile profile) {
      profile.CreateMap<Client, ClientVm>()
        .ForMember(d => d.IsApproved, opt => opt.MapFrom(s => s.DateApprovedUtc.HasValue));
    }
  }
}
using Hie.DB.Entities;
using Hie.Domain.Mappings;

namespace Hie.Domain.Features.Profile.Command.SignInCommand.ViewModels {
  public class BenefactorVm: IMapFrom<Benefactor> {
    public decimal TotalAmount { get; set; }
    public bool AlwaysPayComission { get; set; }
    public long LevelId { get; set; }
    public string LevelName { get; set; }

    public void Mapping(AutoMapper.Profile profile) {
      profile.CreateMap<Benefactor, BenefactorVm>()
        .ForMember(d => d.LevelName, opt => opt.MapFrom(s => s.Level.LevelName));
    }
  }
}
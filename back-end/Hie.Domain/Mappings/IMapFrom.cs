using AutoMapper;

namespace Hie.Domain.Mappings {
  public interface IMapFrom<T> {
    void Mapping(Profile profile) => profile.CreateMap(typeof(T), GetType());
  }
}
namespace Hie.Domain.Services {
  public interface ICurrentUserService {
    long? UserId { get; }
    string TimeZone { get; }
  }
}
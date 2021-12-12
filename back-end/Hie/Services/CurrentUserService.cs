using Hie.Domain.Services;
using Microsoft.AspNetCore.Http;
using System.Security.Claims;

namespace Hie.API.Services {
  public class CurrentUserService: ICurrentUserService {
    public long? UserId {
      get {
        long userId;
        var val = _httpContextAccessor.HttpContext?.User?.FindFirstValue(ClaimTypes.Sid);
        if(long.TryParse(val, out userId)) {
          return userId;
        }
        return null;
      }
    }

    public string TimeZone {
      get {
        var val = _httpContextAccessor.HttpContext?.User?.FindFirstValue(ClaimTypes.Locality);
        if(!string.IsNullOrEmpty(val)) {
          return val;
        }
        return null;
      }
    }

    private readonly IHttpContextAccessor _httpContextAccessor;

    public CurrentUserService(IHttpContextAccessor httpContextAccessor) {
      _httpContextAccessor = httpContextAccessor;
    }
  }
}
using Hie.DB.Entities;
using Hie.Domain.Features.Profile.Command.SignInCommand.ViewModels;
using Hie.Domain.Settings;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;

namespace Hie.Domain.Services {
  public interface IJwtUtils {
    public string GenerateToken(UserVm user);
  }

  public class JwtUtils: IJwtUtils {
    private readonly AppSettings _appSettings;

    public JwtUtils(IOptions<AppSettings> appSettings) {
      _appSettings = appSettings.Value;
    }

    public string GenerateToken(UserVm user) {
      // generate token that is valid for 7 days
      var tokenHandler = new JwtSecurityTokenHandler();
      var key = Encoding.UTF8.GetBytes(_appSettings.Secret);

      var claims = new List<Claim> {
          new Claim(ClaimTypes.Sid, user.Id.ToString()),
          new Claim(ClaimTypes.Name, user.Login),
          new Claim(ClaimTypes.Email, user.Email),
          new Claim(ClaimTypes.MobilePhone, user.Phone),
          new Claim(ClaimTypes.Locality, user.TimeZone),
        };

      if(user.Benefactor != null) {
        claims.Add(new Claim(ClaimTypes.Role, nameof(Benefactor)));
      }
      if(user.Client != null) {
        claims.Add(new Claim(ClaimTypes.Role, nameof(Client)));
      }

      var tokenDescriptor = new SecurityTokenDescriptor {
        Subject = new ClaimsIdentity(claims),
        Expires = DateTime.UtcNow.AddDays(7),
        SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
      };
      var token = tokenHandler.CreateToken(tokenDescriptor);
      return tokenHandler.WriteToken(token);
    }
  }
}
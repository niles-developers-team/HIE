using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using System;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Hie.Domain.Settings;
using System.Security.Claims;
using System.Security.Principal;

namespace Hie.API.Helpers {
  public class JwtMiddleware {
    private readonly RequestDelegate _next;
    private readonly AppSettings _appSettings;

    public JwtMiddleware(RequestDelegate next, IOptions<AppSettings> appSettings) {
      _next = next;
      _appSettings = appSettings.Value;
    }

    public async Task Invoke(HttpContext context) {
      var token = context.Request.Headers["Authorization"].FirstOrDefault()?.Split(" ").Last();

      if (token != null) {
        await AttachUserToContext(context, token);
      }

      await _next(context);
    }

    private async Task AttachUserToContext(HttpContext context, string token) {
      try {
        var tokenHandler = new JwtSecurityTokenHandler();
        var key = Encoding.UTF8.GetBytes(_appSettings.Secret);
        tokenHandler.ValidateToken(token, new TokenValidationParameters {
          ValidateIssuerSigningKey = true,
          IssuerSigningKey = new SymmetricSecurityKey(key),
          ValidateIssuer = false,
          ValidateAudience = false,
          // set clockskew to zero so tokens expire exactly at token expiration time (instead of 5 minutes later)
          ClockSkew = TimeSpan.Zero
        }, out SecurityToken validatedToken);

        var jwtToken = (JwtSecurityToken)validatedToken;
        var userId = int.Parse(jwtToken.Claims.First(x => x.Type == ClaimTypes.Sid).Value);
        var timeZone = jwtToken.Claims.First(x => x.Type == ClaimTypes.Locality).Value;

        // attach user to context on successful jwt validation
        var identity = new ClaimsIdentity(jwtToken.Claims, "basic");
        context.User = new ClaimsPrincipal(identity);
        context.Items["UserId"] = userId;
        context.Items["TimeZone"] = timeZone;
      } catch {
        // do nothing if jwt validation fails
        // user is not attached to context so request won't have access to secure routes
      }
    }
  }
}
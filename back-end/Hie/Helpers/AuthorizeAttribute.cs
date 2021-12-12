using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using System;
using System.Linq;
using System.Security.Claims;

[AttributeUsage(AttributeTargets.Class | AttributeTargets.Method)]
public class AuthorizeAttribute: Attribute, IAuthorizationFilter {
  internal string Role { get; set;}

  public AuthorizeAttribute() {
  }

  public AuthorizeAttribute(string role) : this() {
    Role = role;
  }

  public void OnAuthorization(AuthorizationFilterContext context) {
    long userId;
    if(!long.TryParse(context.HttpContext.Items["UserId"] + "" , out userId)) {
      // not logged in
      context.Result = new JsonResult(new { message = "Unauthorized", Reason = "Пользователь не найден" }) { StatusCode = StatusCodes.Status401Unauthorized };
      return;
    }
    if (!string.IsNullOrEmpty(Role) && !IsInRole(context.HttpContext)) {
      // not access
      context.Result = new JsonResult(new { message = "Access Denied", Reason = "У вас недостаточно прав" }) { StatusCode = StatusCodes.Status401Unauthorized };
      return;
    }
  }

  private bool IsInRole(HttpContext context) {
    var user = context?.User;
    if(user == null) {
      return false;
    }

    var claims = user.FindAll("role");
    return claims.Any(x => x.Value == Role);
  }
}
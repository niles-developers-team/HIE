using Hie.Domain.Exceptions;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Newtonsoft.Json;
using System;
using System.Net;
using System.Threading.Tasks;

namespace Hie.API.Common {
  public class CustomExceptionHandlerMiddleware {
    private readonly RequestDelegate _next;

    public CustomExceptionHandlerMiddleware(RequestDelegate next) {
      _next = next;
    }

    public async Task Invoke(HttpContext context) {
      try {
        await _next(context);
      } catch (Exception ex) {
        await HandleExceptionAsync(context, ex);
      }
    }

    private Task HandleExceptionAsync(HttpContext context, Exception exception) {
      var code = HttpStatusCode.InternalServerError;

      object result = string.Empty;

      switch (exception) {
        case ValidationException validationException:
          code = HttpStatusCode.BadRequest;
          if (validationException.Failures != null && validationException.Failures.Count > 0) {
            result = validationException.Failures;
          } else {
            result = validationException.Message;
          }
          break;
        case AccessDeniedException accessException:
          code = HttpStatusCode.Forbidden;
          result = accessException.Message;
          break;
        case NotFoundException notFoundException:
          code = HttpStatusCode.NotFound;
          result = notFoundException.Message;
          break;
        case UnexpectedError unexpectedError:
          code = HttpStatusCode.InternalServerError;
          result = unexpectedError.Message;
          break;
        default:
          code = HttpStatusCode.InternalServerError;
          result = "Упс, что-то пошло не так. Приносим извинения за временные неудобства.";
          break;
      }

      context.Response.ContentType = "application/json";
      context.Response.StatusCode = (int)code;

      if (result == null) {
        result = new { error = exception.Message };
      }

      return context.Response.WriteAsJsonAsync(new {
        Status = "Error",
        Message = result
      });
    }
  }

  public static class CustomExceptionHandlerMiddlewareExtensions {
    public static IApplicationBuilder UseCustomExceptionHandler(this IApplicationBuilder builder) {
      return builder.UseMiddleware<CustomExceptionHandlerMiddleware>();
    }
  }
}
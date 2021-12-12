using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using MediatR;
using System.Reflection;
using Hie.Domain.Behaviours;
using Hie.Domain.Services;

namespace Hie.Domain {
  public static class DependencyInjection {
    public static IServiceCollection AddDomainServices(this IServiceCollection services, IConfiguration configuration) {
      services.AddAutoMapper(Assembly.GetExecutingAssembly());
      services.AddMediatR(Assembly.GetExecutingAssembly());
      services.AddTransient(typeof(IPipelineBehavior<,>), typeof(RequestPerformanceBehaviour<,>));
      services.AddTransient(typeof(IPipelineBehavior<,>), typeof(RequestValidationBehavior<,>));
      services.AddTransient<IJwtUtils, JwtUtils>();
      return services;
    }
  }
}
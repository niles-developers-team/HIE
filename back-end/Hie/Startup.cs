using Hie.API.Common;
using Hie.API.Helpers;
using Hie.API.Services;
using Hie.Domain;
using Hie.Domain.Services;
using Hie.Domain.Settings;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.HttpsPolicy;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.DependencyInjection.Extensions;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Microsoft.OpenApi.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Hie {
  public class Startup {
    public Startup(IConfiguration configuration, IWebHostEnvironment environment) {
      Configuration = configuration;
      Environment = environment;
    }

    public IConfiguration Configuration { get; }

    public IWebHostEnvironment Environment { get; }

    // This method gets called by the runtime. Use this method to add services to the container.
    public void ConfigureServices(IServiceCollection services) {

      DependencyInjection.AddDomainServices(services, Configuration);
      DB.DependencyInjection.AddDb(services, Configuration, Environment);

      services.TryAddSingleton<IHttpContextAccessor, HttpContextAccessor>();
      services.AddScoped<ICurrentUserService, CurrentUserService>();
      services.AddScoped<IDateService, DateService>();

      // configure strongly typed settings object
      services.Configure<AppSettings>(Configuration.GetSection(AppSettings.SectionName));

      services.AddControllers();
      services.AddSwaggerGen(c => {
        c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme {
          Description = @"JWT Authorization header using the Bearer scheme. \r\n\r\n 
                      Enter 'Bearer' [space] and then your token in the text input below.
                      \r\n\r\nExample: 'Bearer 12345abcdef'",
          Name = "Authorization",
          In = ParameterLocation.Header,
          Type = SecuritySchemeType.ApiKey,
          Scheme = "Bearer"
        });
        c.AddSecurityRequirement(new OpenApiSecurityRequirement(){ {
          new OpenApiSecurityScheme {
            Reference = new OpenApiReference
              {
                Type = ReferenceType.SecurityScheme,
                Id = "Bearer"
              },
              Scheme = "oauth2",
              Name = "Bearer",
              In = ParameterLocation.Header,
            },
            new List<string>()
          }
        });
        c.SwaggerDoc("v1", new OpenApiInfo { Title = "Hie", Version = "v1" });
      });
    }

    // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
    public void Configure(IApplicationBuilder app, IWebHostEnvironment env) {
      if (env.IsDevelopment()) {
        app.UseDeveloperExceptionPage();
        app.UseSwagger();
        app.UseSwaggerUI(c => c.SwaggerEndpoint("/swagger/v1/swagger.json", "Hie v1"));
      }

      app.UseMiddleware<JwtMiddleware>();

      app.UseCustomExceptionHandler();
      app.UseHttpsRedirection();

      app.UseRouting();

      app.UseAuthorization();

      app.UseEndpoints(endpoints => {
        endpoints.MapControllers();
      });
    }
  }
}

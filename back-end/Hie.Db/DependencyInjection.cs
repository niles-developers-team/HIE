using Microsoft.AspNetCore.Hosting;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Hie.Domain.Repositories;
using Microsoft.EntityFrameworkCore.Diagnostics;

namespace Hie.DB {
  public static class DependencyInjection {
    public static IServiceCollection AddDb(this IServiceCollection services, IConfiguration configuration, IWebHostEnvironment environment){
      DbContextOptionsBuilder options = new DbContextOptionsBuilder();
      if (environment.IsDevelopment()) {
        services.AddDbContext<HieAppContext>(x => TestDb(x, configuration));
      } else {
        services.AddDbContext<HieAppContext>(x => ProductionDb(x, configuration));
      }

      services.AddTransient<IAppDbContext, HieAppContext>();

      return services;
    }

    private static void TestDb(DbContextOptionsBuilder o, IConfiguration configuration) {
      //o.UseSqlServer(configuration.GetConnectionString("DefaultConnection"),
      //              b => b.MigrationsAssembly(typeof(HieAppContext).Assembly.FullName));
      o.UseInMemoryDatabase(databaseName: "Test")
        .ConfigureWarnings(x => x.Ignore(InMemoryEventId.TransactionIgnoredWarning));
    }

    private static void ProductionDb(DbContextOptionsBuilder o, IConfiguration configuration) {
      o.UseSqlServer(configuration.GetConnectionString("DefaultConnection"), 
                    b => b.MigrationsAssembly(typeof(HieAppContext).Assembly.FullName));
    }
  }
}
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Hie.DB.Entities;
using Hie.Domain.Enums;
using System.Threading.Tasks;
using Microsoft.Extensions.Configuration;
using Microsoft.EntityFrameworkCore;
using System;
using Hie.Domain.Settings;
using Hie.Helpers;

namespace Hie.DB {
  public static class HieAppContextSeed {
    internal static async Task SeedAsync(HieAppContext context, string salt) {
      using (var transaction = await context.Database.BeginTransactionAsync()) {
        try {

          if (!await context.BenefactorLevels.AnyAsync()) {
            await context.BenefactorLevels.AddRangeAsync(new[]{
              new BenefactorLevel { LevelName = "Начинающий", Order = 1, MinAmount = 0 },
              new BenefactorLevel { LevelName = "Опытный", Order = 2, MinAmount = 1000 },
              new BenefactorLevel { LevelName = "Профи", Order = 3, MinAmount = 2000 },
            });
            await context.SaveChangesAsync();
          }

          if (!await context.Users.AnyAsync()) {
            //await context.Database.ExecuteSqlRawAsync($"SET IDENTITY_INSERT {nameof(context.Users)} ON");
            await context.Users.AddRangeAsync(new[]{
              new User { Email = "testclient@mail.ru", Login = "Клиент Тестович", Phone = "80000000000", TimeZone = "Russian Standard Time",
               PasswordHash = PasswordHashHelper.HashPassword(salt, "testClient") },
              new User { Email = "testbenefactor@mail.ru", Login = "Благотворитель Тестович", Phone = "80000000000", TimeZone = "Russian Standard Time",
               PasswordHash = PasswordHashHelper.HashPassword(salt, "testBenefactor") }
            });

            await context.SaveChangesAsync();
            await context.Benefactors.AddRangeAsync(new[]{
              new Benefactor { Id = 2, AlwaysPayComission = true, TotalAmount = 0, LevelId = 1 },
            });

            await context.Clients.AddRangeAsync(new[]{
              new Client { Id = 1, INN = "1111111111", Kpp = "1111111111", Ogrn = "80000000000", PersonalBankAccount = "1000000000000000",
            } });
            await context.SaveChangesAsync();
            //await context.Database.ExecuteSqlRawAsync($"SET IDENTITY_INSERT {nameof(context.Users)} OFF");
          }

          await transaction.CommitAsync();
        } catch (Exception ex) {
          await transaction.RollbackAsync();
        }
      }
    }

    public static IHost SeedData(this IHost host) {
      using (var scope = host.Services.CreateScope()) {
        var services = scope.ServiceProvider;
        var context = services.GetService<HieAppContext>();

        var configuration = services.GetService<IConfiguration>();
        var salt = configuration.GetSection(AppSettings.SectionName).GetValue<string>(nameof(AppSettings.Secret));

        SeedAsync(context, salt).GetAwaiter().GetResult();
      }
      return host;
    }
  }
}

using Hie.DB.Entities;
using Hie.Domain.Exceptions;
using Hie.Domain.Repositories;
using Hie.Domain.Settings;
using Hie.Helpers;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using System;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace Hie.Domain.Features.Profile.Command.CreateUserCommand {
  public class CreateClientCommand: CreateUserCommand, IRequest<long> {
    [Required]
    public string INN { get; set; }
    [Required]
    public string Kpp { get; set; }
    [Required]
    public string Ogrn { get; set; }
    [Required]
    public string PersonalBankAccount { get; set; }

    public class CreateClientCommandHandler: IRequestHandler<CreateClientCommand, long> {
      private readonly IAppDbContext _context;
      private readonly AppSettings _appSettingOption;

      public CreateClientCommandHandler(IAppDbContext context, IOptions<AppSettings> appSettingOption) {
        _context = context;
        _appSettingOption = appSettingOption.Value;
      }

      public async Task<long> Handle(CreateClientCommand request, CancellationToken cancellationToken) {
        var entity = new User {
          Email = request.Email,
          Login = request.Login,
          Phone = request.Phone,
          TimeZone = request.TimeZone,
          PasswordHash = PasswordHashHelper.HashPassword(_appSettingOption.Secret, request.Password),
        };

        await _context.BeginTransaction();
        try {
          _context.Users.Add(entity);
          await _context.SaveChangesAsync();

          var client = new Client {
            Id = entity.Id,
            INN = request.INN,
            Kpp = request.Kpp,
            Ogrn = request.Ogrn,
            PersonalBankAccount = request.PersonalBankAccount,
          };
          _context.Clients.Add(client);

          await _context.SaveChangesAndCommitTransaction();
        } catch(Exception ex) {
          await _context.RollBack();
          throw new UnexpectedError(ex);
        }

        return entity.Id;
      }
    }
  }
}

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
  public class CreateBenefactorCommand: CreateUserCommand, IRequest<long> {
    [Required]
    public bool AlwaysPayComission { get; set; } = true;

    public class CreateBenefactorCommandHandler: IRequestHandler<CreateBenefactorCommand, long> {
      private readonly IAppDbContext _context;
      private readonly AppSettings _appSettingOption;

      public CreateBenefactorCommandHandler(IAppDbContext context, IOptions<AppSettings> appSettingOption) {
        _context = context;
        _appSettingOption = appSettingOption.Value;
      }

      public async Task<long> Handle(CreateBenefactorCommand request, CancellationToken cancellationToken) {


        await _context.BeginTransaction();
        try {
          var entity = new User {
            Email = request.Email,
            Login = request.Login,
            Phone = request.Phone,
            TimeZone = request.TimeZone,
            PasswordHash = PasswordHashHelper.HashPassword(_appSettingOption.Secret, request.Password),
          };

          _context.Users.Add(entity);
          await _context.SaveChangesAsync();

          var lvl = await _context.BenefactorLevels.FirstOrDefaultAsync(x => x.Order == 1);

          var client = new Benefactor {
            Id = entity.Id,
            LevelId = lvl.Id,
            AlwaysPayComission = request.AlwaysPayComission,
          };
          _context.Benefactors.Add(client);

          await _context.SaveChangesAndCommitTransaction();
          return entity.Id;
        } catch (Exception ex) {
          await _context.RollBack();
          throw new UnexpectedError(ex);
        }
      }
    }
  }
}
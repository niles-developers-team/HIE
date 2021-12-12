using AutoMapper;
using AutoMapper.QueryableExtensions;
using Hie.Domain.Features.Profile.Command.SignInCommand.ViewModels;
using Hie.Domain.Repositories;
using Hie.Domain.Services;
using Hie.Domain.Settings;
using Hie.Helpers;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using ValidationException = Hie.Domain.Exceptions.ValidationException;

namespace Hie.Domain.Features.Profile.Command.SignInCommand {
  public class SignInCommand: IRequest<UserVm> {
    public string Email { get; set; }
    public string Phone { get; set; }
    [Required]
    public string Password { get; set; }

    public class SignInCommandCommandHandler: IRequestHandler<SignInCommand, UserVm> {
      private readonly IMapper _mapper;
      private readonly IJwtUtils _jwtUtils;
      private readonly IAppDbContext _context;
      private readonly AppSettings _appSettingOption;

      public SignInCommandCommandHandler(IAppDbContext context, IOptions<AppSettings> appSettingOption, IJwtUtils jwtUtils, IMapper mapper) {
        _mapper = mapper;
        _context = context;
        _jwtUtils = jwtUtils;
        _appSettingOption = appSettingOption.Value;
      }

      public async Task<UserVm> Handle(SignInCommand request, CancellationToken cancellationToken) {
        var hash = PasswordHashHelper.HashPassword(_appSettingOption.Secret, request.Password);
        var users = await _context.Users
          .Include(x => x.Client)
          .Include(x => x.Benefactor)
          .Where(x => (x.Email == request.Email || x.Phone == request.Phone) && x.PasswordHash == hash)
          .ProjectTo<UserVm>(_mapper.ConfigurationProvider)
          .ToListAsync();

        if (users.Count != 1) {
          throw new ValidationException("Не верно указан логин или пароль");
        }

        var user = users.FirstOrDefault();
        user.Token = _jwtUtils.GenerateToken(user);

        return user;
      }
    }
  }
}
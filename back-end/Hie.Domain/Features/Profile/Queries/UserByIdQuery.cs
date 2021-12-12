using AutoMapper;
using AutoMapper.QueryableExtensions;
using Hie.Domain.Exceptions;
using Hie.Domain.Features.Profile.Command.SignInCommand.ViewModels;
using Hie.Domain.Repositories;
using Hie.Domain.Services;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace Hie.Domain.Features.Profile.Query {
  public class UserByIdQuery : IRequest<UserVm> {
    public long? UserId { get; set; }

    public class UserByIdQueryHandler: IRequestHandler<UserByIdQuery, UserVm> {
      private readonly IAppDbContext _context;
      private readonly IMapper _mapper;
      private readonly ICurrentUserService _currentUserService;

      public UserByIdQueryHandler(IAppDbContext context, ICurrentUserService currentUserService, IMapper mapper) {
        _context = context;
        _mapper = mapper;
        _currentUserService = currentUserService;
      }

      public async Task<UserVm> Handle(UserByIdQuery request, CancellationToken cancellationToken) {
        if (!request.UserId.HasValue) {
          request.UserId = _currentUserService.UserId;
        }

        var users = await _context.Users
          .Include(x => x.Client)
          .Include(x => x.Benefactor)
          .Where(x => x.Id == _currentUserService.UserId.Value)
          .ProjectTo<UserVm>(_mapper.ConfigurationProvider)
          .ToListAsync();
        if(users.Count == 0) {
          throw new NotFoundException("Пользователь не найден");
        }
        return users.FirstOrDefault();
      }
    }
  }
}

using Hie.DB.Entities;
using Hie.Domain.Repositories;
using Hie.Domain.Services;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace Hie.Domain.Features.Profile.Command.FollowCommand {
  public class UserFollowCommand: IRequest {
    public long FollowedUserId { get; set; }

    public class UserFollowCommandHandler: IRequestHandler<UserFollowCommand> {
      private readonly IAppDbContext _context;
      private readonly ICurrentUserService _currentUserService;

      public UserFollowCommandHandler(IAppDbContext context, ICurrentUserService currentUserService) {
        _context = context;
        _currentUserService = currentUserService;
      }

      public async Task<Unit> Handle(UserFollowCommand request, CancellationToken cancellationToken) {
        if(request.FollowedUserId == _currentUserService.UserId.Value) {
          return Unit.Value;
        }

        if(await _context.Follows.AnyAsync(x => x.FollowedId == request.FollowedUserId && x.FollowerId == _currentUserService.UserId.Value)) {
          return Unit.Value;
        }

        await _context.Follows.AddAsync(new Follow {
          FollowedId = request.FollowedUserId,
          FollowerId = _currentUserService.UserId.Value,
        });
        await _context.SaveChangesAsync();
        return Unit.Value;
      }
    }
  }
}

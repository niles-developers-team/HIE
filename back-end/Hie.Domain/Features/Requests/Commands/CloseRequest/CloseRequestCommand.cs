using Hie.Domain.Enums;
using Hie.Domain.Exceptions;
using Hie.Domain.Repositories;
using Hie.Domain.Services;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System.Threading;
using System.Threading.Tasks;

namespace Hie.Domain.Features.Requests.Commands.CloseRequest {
  public class CloseRequestCommand: IRequest {
    public long Id { get; set; }

    public class CloseRequestCommandHandler: IRequestHandler<CloseRequestCommand> {
      private readonly IAppDbContext _context;
      private readonly ICurrentUserService _currentUserService;
      private readonly IDateService _dateService;

      public CloseRequestCommandHandler(IAppDbContext context, IDateService dateService, ICurrentUserService currentUserService) {
        _context = context;
        _dateService = dateService;
        _currentUserService = currentUserService;
      }

      public async Task<Unit> Handle(CloseRequestCommand request, CancellationToken cancellationToken) {
        var entity = await _context.Requests.FirstOrDefaultAsync(x => x.Id == request.Id);
        if (entity == null) {
          return Unit.Value;
        }
        if(entity.ClientId != _currentUserService.UserId.Value) {
          throw new AccessDeniedException();
        }

        entity.RequestStatus = (int)RequestStatus.Close;

        _context.Requests.Update(entity);
        await _context.SaveChangesAsync();
        return Unit.Value;
      }
    }
  }
}
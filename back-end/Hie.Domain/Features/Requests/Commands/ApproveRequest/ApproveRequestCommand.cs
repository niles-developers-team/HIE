using Hie.Domain.Enums;
using Hie.Domain.Exceptions;
using Hie.Domain.Repositories;
using Hie.Domain.Services;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System.Threading;
using System.Threading.Tasks;

namespace Hie.Domain.Features.Requests.Commands.ApproveRequest {
  public class ApproveRequestCommand: IRequest {
    public long Id { get; set; }

    public class ApproveRequestCommandHandler: IRequestHandler<ApproveRequestCommand> {
      private readonly IAppDbContext _context;
      private readonly ICurrentUserService _currentUserService;
      private readonly IDateService _dateService;

      public ApproveRequestCommandHandler(IAppDbContext context, IDateService dateService, ICurrentUserService currentUserService) {
        _context = context;
        _dateService = dateService;
        _currentUserService = currentUserService;
      }

      public async Task<Unit> Handle(ApproveRequestCommand request, CancellationToken cancellationToken) {
        var entity = await _context.Requests.FirstOrDefaultAsync(x => x.Id == request.Id);
        if (entity == null) {
          throw new NotFoundException("Заявка не найдена");
        }
        if(entity.ClientId != _currentUserService.UserId.Value) {
          throw new AccessDeniedException();
        }

        entity.RequestStatus = (int)RequestStatus.Approve;

        _context.Requests.Update(entity);
        await _context.SaveChangesAsync();
        return Unit.Value;
      }
    }
  }
}
using Hie.Domain.Exceptions;
using Hie.Domain.Repositories;
using Hie.Domain.Services;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace Hie.Domain.Features.Requests.Commands.UpdateRequest {
  public class UpdateRequestCommand: IRequest<long> {
    public long Id { get; set; }
    public string Description { get; set; }
    public DateTime DeadlineDate { get; set; }

    public class UpdateRequestCommandHandler: IRequestHandler<UpdateRequestCommand, long> {
      private readonly IAppDbContext _context;
      private readonly ICurrentUserService _currentUserService;
      private readonly IDateService _dateService;

      public UpdateRequestCommandHandler(IAppDbContext context, IDateService dateService, ICurrentUserService currentUserService) {
        _context = context;
        _dateService = dateService;
        _currentUserService = currentUserService;
      }

      public async Task<long> Handle(UpdateRequestCommand request, CancellationToken cancellationToken) {
        var entity = await _context.Requests.FirstOrDefaultAsync(x => x.Id == request.Id);
        if (entity == null) {
          throw new NotFoundException("Заявка не найдена");
        }
        if(entity.ClientId != _currentUserService.UserId.Value) {
          throw new AccessDeniedException();
        }

        entity.Description = request.Description;
        entity.DeadlineDateUtc = _dateService.ToUtcDate(request.DeadlineDate);

        _context.Requests.Update(entity);
        await _context.SaveChangesAsync();
        return entity.Id;
      }
    }
  }
}
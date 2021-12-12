using Hie.Domain.Exceptions;
using Hie.Domain.Repositories;
using Hie.Domain.Services;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System.Threading;
using System.Threading.Tasks;

namespace Hie.Domain.Features.AutoPaymentFeature.Commands.DeleteAutoPayment {
  public class DeleteAutoPaymentCommand: IRequest {
    public long Id { get; set; }

    public class DeleteAutoPaymentCommandHandler: IRequestHandler<DeleteAutoPaymentCommand> {
      private readonly IAppDbContext _context;
      private readonly ICurrentUserService _currentUserService;
      private readonly IDateService _dateService;

      public DeleteAutoPaymentCommandHandler(IAppDbContext context, IDateService dateService, ICurrentUserService currentUserService) {
        _context = context;
        _dateService = dateService;
        _currentUserService = currentUserService;
      }

      public async Task<Unit> Handle(DeleteAutoPaymentCommand request, CancellationToken cancellationToken) {
        var entity = await _context.AutoPaymentBenefactors.FirstOrDefaultAsync(x => x.Id == request.Id);
        if (entity == null) {
          return Unit.Value;
        }
        if(entity.BenefactorId != _currentUserService.UserId.Value) {
          throw new AccessDeniedException();
        }

        _context.AutoPaymentBenefactors.Remove(entity);
        await _context.SaveChangesAsync();
        return Unit.Value;
      }
    }
  }
}
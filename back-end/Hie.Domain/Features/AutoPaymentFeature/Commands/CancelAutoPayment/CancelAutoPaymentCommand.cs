using Hie.Domain.Exceptions;
using Hie.Domain.Repositories;
using Hie.Domain.Services;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System.Threading;
using System.Threading.Tasks;

namespace Hie.Domain.Features.AutoPaymentFeature.Commands.CancelAutoPayment {
  public class CancelAutoPaymentCommand: IRequest {
    public long Id { get; set; }

    public class CancelAutoPaymentCommandHandler: IRequestHandler<CancelAutoPaymentCommand> {
      private readonly IAppDbContext _context;
      private readonly ICurrentUserService _currentUserService;
      private readonly IDateService _dateService;

      public CancelAutoPaymentCommandHandler(IAppDbContext context, IDateService dateService, ICurrentUserService currentUserService) {
        _context = context;
        _dateService = dateService;
        _currentUserService = currentUserService;
      }

      public async Task<Unit> Handle(CancelAutoPaymentCommand request, CancellationToken cancellationToken) {
        var entity = await _context.AutoPaymentBenefactors.FirstOrDefaultAsync(x => x.Id == request.Id);
        if (entity == null) {
          throw new NotFoundException("Автоплатеж не найден");
        }
        if(entity.BenefactorId != _currentUserService.UserId.Value) {
          throw new AccessDeniedException();
        }

        entity.CancelDateUtc = _dateService.GetDate();

        _context.AutoPaymentBenefactors.Update(entity);
        await _context.SaveChangesAsync();
        return Unit.Value;
      }
    }
  }
}
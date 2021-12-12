using Hie.Domain.Exceptions;
using Hie.Domain.Repositories;
using Hie.Domain.Services;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System.Threading;
using System.Threading.Tasks;

namespace Hie.Domain.Features.AutoPaymentFeature.Commands.UpdateAutoPayment {
  public class UpdateAutoPaymentCommand: IRequest<long> {
    public long Id { get; set; }
    public decimal Amount { get; set; }
    public int PeriodDays { get; set; }

    public class UpdateAutoPaymentCommandHandler: IRequestHandler<UpdateAutoPaymentCommand, long> {
      private readonly IAppDbContext _context;
      private readonly ICurrentUserService _currentUserService;
      private readonly IDateService _dateService;

      public UpdateAutoPaymentCommandHandler(IAppDbContext context, IDateService dateService, ICurrentUserService currentUserService) {
        _context = context;
        _dateService = dateService;
        _currentUserService = currentUserService;
      }

      public async Task<long> Handle(UpdateAutoPaymentCommand request, CancellationToken cancellationToken) {
        var entity = await _context.AutoPaymentBenefactors.FirstOrDefaultAsync(x => x.Id == request.Id);
        if (entity == null) {
          throw new NotFoundException("Автоплатеж не найден");
        }
        if(entity.BenefactorId != _currentUserService.UserId.Value) {
          throw new AccessDeniedException();
        }

        entity.Amount = request.Amount;
        entity.PeriodDays = request.PeriodDays;

        _context.AutoPaymentBenefactors.Update(entity);
        await _context.SaveChangesAsync();
        return entity.Id;
      }
    }
  }
}
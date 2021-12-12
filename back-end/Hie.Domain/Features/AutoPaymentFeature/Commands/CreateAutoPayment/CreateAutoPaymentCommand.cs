using Hie.DB.Entities;
using Hie.Domain.Exceptions;
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

namespace Hie.Domain.Features.AutoPaymentFeature.Commands.CreateAutoPayment {
  public class CreateAutoPaymentCommand: IRequest<long> {
    public decimal Amount { get; set; }
    public int PeriodDays { get; set; }
    public long? ClientId { get; set; }

    public class CreateAutoPaymentCommandHandler: IRequestHandler<CreateAutoPaymentCommand, long> {
      private readonly IAppDbContext _context;
      private readonly ICurrentUserService _currentUserService;
      private readonly IDateService _dateService;

      public CreateAutoPaymentCommandHandler(IAppDbContext context, IDateService dateService, ICurrentUserService currentUserService) {
        _context = context;
        _dateService = dateService;
        _currentUserService = currentUserService;
      }

      public async Task<long> Handle(CreateAutoPaymentCommand request, CancellationToken cancellationToken) {
        if (request.ClientId.HasValue) {
          var client = await _context.Clients.FirstOrDefaultAsync(x => x.Id == request.ClientId);
          if(client == null) {
            throw new NotFoundException("Клиент не найден");
          }
        }

        var entity = new AutoPaymentBenefactor {
          CreateDateUtc = _dateService.GetDate(),
          BenefactorId = _currentUserService.UserId.Value,
          ClientId = request.ClientId,
          Amount = request.Amount,
          PeriodDays = request.PeriodDays,
        };

        await _context.AutoPaymentBenefactors.AddAsync(entity);
        await _context.SaveChangesAsync();
        return entity.Id;
      }
    }
  }
}
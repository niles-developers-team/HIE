using AutoMapper;
using AutoMapper.QueryableExtensions;
using Hie.Domain.Repositories;
using Hie.Domain.Services;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace Hie.Domain.Features.AutoPaymentFeature.Queries {
  public class MyAutoPaymentQuery: IRequest<IReadOnlyCollection<MyAutoPaymentBenefactorVm>> {
    public AutoPaymentStatus PaymentStatus { get; set; }

    public class MyAutoPaymentQueryHandler: IRequestHandler<MyAutoPaymentQuery, IReadOnlyCollection<MyAutoPaymentBenefactorVm>> {
      private readonly IAppDbContext _context;
      private readonly IMapper _mapper;
      private readonly IDateService _dateService;
      private readonly ICurrentUserService _currentUserService;

      public MyAutoPaymentQueryHandler(IAppDbContext context, IDateService dateService, ICurrentUserService currentUserService, IMapper mapper) {
        _context = context;
        _mapper = mapper;
        _dateService = dateService;
        _currentUserService = currentUserService;
      }

      public async Task<IReadOnlyCollection<MyAutoPaymentBenefactorVm>> Handle(MyAutoPaymentQuery request, CancellationToken cancellationToken) {
        var query = _context.AutoPaymentBenefactors.AsNoTracking().AsQueryable()
          .Where(x => x.BenefactorId == _currentUserService.UserId.Value);

        if (request.PaymentStatus == AutoPaymentStatus.Active) {
          query = query.Where(x => !x.CancelDateUtc.HasValue);
        }
        if (request.PaymentStatus == AutoPaymentStatus.Cancel) {
          query = query.Where(x => x.CancelDateUtc.HasValue);
        }

        var payments = await query
          .OrderByDescending(x => x.CreateDateUtc)
          .ProjectTo<MyAutoPaymentBenefactorVm>(_mapper.ConfigurationProvider)
          .ToListAsync();
        foreach(var payment in payments) {
          payment.LastDate = _dateService.ToLocalDate(payment.LastDate);
          payment.CreateDate = _dateService.ToLocalDate(payment.CreateDate);
        }
        return payments;
      }
    }

    public enum AutoPaymentStatus {
      All = 0,
      Active = 1,
      Cancel = 2,
    }
  }
}

using AutoMapper;
using AutoMapper.QueryableExtensions;
using Hie.Domain.Enums;
using Hie.Domain.Repositories;
using Hie.Domain.Services;
using Hie.Helpers;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace Hie.Domain.Features.Requests.Queries.BenefactorRequest {
  public class BenefactorRequestsQuery: IRequest<IReadOnlyCollection<BenefactorRequestVm>> {

    public class BenefactorRequestsQueryHandler: IRequestHandler<BenefactorRequestsQuery, IReadOnlyCollection<BenefactorRequestVm>> {
      private readonly IAppDbContext _context;
      private readonly IMapper _mapper;
      private readonly IDateService _dateService;
      private readonly ICurrentUserService _currentUserService;

      public BenefactorRequestsQueryHandler(IAppDbContext context, IDateService dateService, ICurrentUserService currentUserService, IMapper mapper) {
        _context = context;
        _mapper = mapper;
        _dateService = dateService;
        _currentUserService = currentUserService;
      }

      public async Task<IReadOnlyCollection<BenefactorRequestVm>> Handle(BenefactorRequestsQuery request, CancellationToken cancellationToken) {
        var ids = await _context.Follows
          .Where(x => x.FollowerId == _currentUserService.UserId.Value && x.FollowedUser.Client != null)
          .Select(x => x.FollowedId)
          .ToListAsync();
        var query = _context.Requests.AsNoTracking().AsQueryable()
          .Where(x => ids.Contains(x.ClientId))
          .Where(x => x.RequestStatus == (int)RequestStatus.Approve);

        var requests = await query
          .OrderBy(x => x.RequestPriority)
          .ThenByDescending(x => x.CreateDateUtc)
          .ProjectTo<BenefactorRequestVm>(_mapper.ConfigurationProvider)
          .ToListAsync();
        foreach(var userRequest in requests) {
          userRequest.DeadlineDate = _dateService.ToLocalDate(userRequest.DeadlineDate);
          userRequest.CreateDate = _dateService.ToLocalDate(userRequest.CreateDate);
          userRequest.RequestStatusName = EnumHelper.GetDescription(userRequest.RequestStatus);
          userRequest.RequestPriorityName = EnumHelper.GetDescription(userRequest.RequestPriority);
        }
        return requests;
      }
    }
  }
}
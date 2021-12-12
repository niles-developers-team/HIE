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

namespace Hie.Domain.Features.Requests.Queries.MyRequest {
  public class MyRequestsQuery: IRequest<IReadOnlyCollection<MyRequestVm>> {
    public RequestStatus? RequestStatus { get; set; }

    public class MyRequestsQueryHandler: IRequestHandler<MyRequestsQuery, IReadOnlyCollection<MyRequestVm>> {
      private readonly IAppDbContext _context;
      private readonly IMapper _mapper;
      private readonly IDateService _dateService;
      private readonly ICurrentUserService _currentUserService;

      public MyRequestsQueryHandler(IAppDbContext context, IDateService dateService, ICurrentUserService currentUserService, IMapper mapper) {
        _context = context;
        _mapper = mapper;
        _dateService = dateService;
        _currentUserService = currentUserService;
      }

      public async Task<IReadOnlyCollection<MyRequestVm>> Handle(MyRequestsQuery request, CancellationToken cancellationToken) {
        var query = _context.Requests.AsNoTracking().AsQueryable()
          .Where(x => x.ClientId == _currentUserService.UserId.Value);

        if (request.RequestStatus.HasValue) {
          query = query.Where(x => x.RequestStatus == (int)request.RequestStatus.Value);
        }

        var requests = await query
          .OrderBy(x => x.RequestPriority)
          .ThenByDescending(x => x.CreateDateUtc)
          .ProjectTo<MyRequestVm>(_mapper.ConfigurationProvider)
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
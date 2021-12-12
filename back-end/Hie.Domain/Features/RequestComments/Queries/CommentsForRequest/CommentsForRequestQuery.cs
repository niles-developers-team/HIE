using AutoMapper;
using AutoMapper.QueryableExtensions;
using Hie.Domain.Repositories;
using Hie.Domain.Services;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace Hie.Domain.Features.RequestComments.Queries.CommentsForRequest {
  public class CommentsForRequestQuery: IRequest<IReadOnlyCollection<CommentForRequestVm>> {
    public long RequestId{ get; set; }

    public class CommentsForRequestQueryHandler: IRequestHandler<CommentsForRequestQuery, IReadOnlyCollection<CommentForRequestVm>> {
      private readonly IAppDbContext _context;
      private readonly IMapper _mapper;
      private readonly IDateService _dateService;
      private readonly ICurrentUserService _currentUserService;

      public CommentsForRequestQueryHandler(IAppDbContext context, IDateService dateService, ICurrentUserService currentUserService, IMapper mapper) {
        _context = context;
        _mapper = mapper;
        _dateService = dateService;
        _currentUserService = currentUserService;
      }

      public async Task<IReadOnlyCollection<CommentForRequestVm>> Handle(CommentsForRequestQuery request, CancellationToken cancellationToken) {
        var query = _context.RequestComments.AsNoTracking().AsQueryable()
          .Where(x => x.RequestId == request.RequestId);

        var requests = await query
          .OrderByDescending(x => x.CreateDateUtc)
          .ProjectTo<CommentForRequestVm>(_mapper.ConfigurationProvider)
          .ToListAsync();
        foreach(var userRequest in requests) {
          userRequest.CreateDate = _dateService.ToLocalDate(userRequest.CreateDate);
        }
        return requests;
      }
    }
  }
}
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

namespace Hie.Domain.Features.ChatMessages.Queries.DetailChat {
  public class DetailChatQuery: IRequest<IReadOnlyCollection<ChatMessageVm>> {
    public long? RequestId { get; set; }
    public long RecepeintId { get; set; }

    public class ChatsQueryHandler: IRequestHandler<DetailChatQuery, IReadOnlyCollection<ChatMessageVm>> {
      private readonly IAppDbContext _context;
      private readonly IMapper _mapper;
      private readonly IDateService _dateService;
      private readonly ICurrentUserService _currentUserService;

      public ChatsQueryHandler(IAppDbContext context, IDateService dateService, ICurrentUserService currentUserService, IMapper mapper) {
        _context = context;
        _mapper = mapper;
        _dateService = dateService;
        _currentUserService = currentUserService;
      }

      public async Task<IReadOnlyCollection<ChatMessageVm>> Handle(DetailChatQuery request, CancellationToken cancellationToken) {
        var query = _context.ChatMessages.AsNoTracking().AsQueryable()
          .Include(x => x.Sender)
          .Include(x => x.Recepient)
          .Where(x => (x.RecepientId == _currentUserService.UserId.Value && x.SenderId == request.RecepeintId)
            || (x.RecepientId == request.RecepeintId && x.SenderId == _currentUserService.UserId.Value));

        if (request.RequestId.HasValue) {
          query = query.Where(x => x.RequestId == request.RequestId);
        }

        var msgs = await query
          .OrderByDescending(x => x.CreateDateUtc)
          .ProjectTo<ChatMessageVm>(_mapper.ConfigurationProvider)
          .ToListAsync();

        foreach(var msg in msgs) {
          msg.CreateDate = _dateService.ToLocalDate(msg.CreateDate);
        }
        return msgs;
      }
    }
  }
}
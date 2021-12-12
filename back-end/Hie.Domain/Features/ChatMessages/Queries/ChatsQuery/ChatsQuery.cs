using AutoMapper;
using Hie.Domain.Repositories;
using Hie.Domain.Services;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace Hie.Domain.Features.ChatMessages.Queries.ChatsQuery {
  public class ChatsQuery: IRequest<IReadOnlyCollection<ChatVm>> {

    public class ChatsQueryHandler: IRequestHandler<ChatsQuery, IReadOnlyCollection<ChatVm>> {
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

      public async Task<IReadOnlyCollection<ChatVm>> Handle(ChatsQuery request, CancellationToken cancellationToken) {
        var res = new List<ChatVm>();

        var messgs = await _context.ChatMessages.AsNoTracking().AsQueryable()
          .Include(x => x.Sender)
          .Include(x => x.Recepient)
          .Where(x => x.RecepientId == _currentUserService.UserId.Value || x.SenderId == _currentUserService.UserId.Value)
          .ToListAsync();

        var incoming = messgs
          .Where(x => x.RecepientId == _currentUserService.UserId.Value)
          .GroupBy(x => x.SenderId, (key,g) => g.OrderByDescending(x => x.CreateDateUtc).First())
          .Select(x => new ChatVm {
            MessageId = x.Id,
            RecepientId = x.SenderId,
            RecepientLogin = x.Sender.Login,
            RequestId = x.RequestId,
            LastMessage = new LastMessageVm {
              CreateDate = x.CreateDateUtc,
              Text = x.Text,
            }
          }).ToList();

        var outcoming = messgs
          .Where(x => x.SenderId == _currentUserService.UserId.Value)
          .OrderByDescending(e => e.CreateDateUtc)
          .GroupBy(x => x.SenderId, (key,g) => g.OrderByDescending(x => x.CreateDateUtc).First())
          .Select(x => new ChatVm {
            MessageId = x.Id,
            RecepientId = x.RecepientId,
            RecepientLogin = x.Recepient.Login,
            RequestId = x.RequestId,
            LastMessage = new LastMessageVm {
              CreateDate = x.CreateDateUtc,
              Text = x.Text,
            }
          }).ToList();

        res = incoming.Union(outcoming).GroupBy(x => x.MessageId, (key,g) => g.First()).ToList();
        foreach(var msg in res) {
          if(msg.LastMessage == null) {
            continue;
          }

          msg.LastMessage.CreateDate = _dateService.ToLocalDate(msg.LastMessage.CreateDate);
        }

        return res;
      }
    }
  }
}
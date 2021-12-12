using Hie.DB.Entities;
using Hie.Domain.Repositories;
using Hie.Domain.Services;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;
using System.Threading;
using System.Threading.Tasks;

namespace Hie.Domain.Features.ChatMessages.Commands.CreateChatMessage {
  public class CreateChatMessageCommand: IRequest<long> {
    public long? RecepientId { get; set; }
    public long? RequestId { get; set; }
    public string Text { get; set; }

    public class CreateRequestCommentCommandHandler: IRequestHandler<CreateChatMessageCommand, long> {
      private readonly IAppDbContext _context;
      private readonly ICurrentUserService _currentUserService;
      private readonly IDateService _dateService;

      public CreateRequestCommentCommandHandler(IAppDbContext context, IDateService dateService, ICurrentUserService currentUserService) {
        _context = context;
        _dateService = dateService;
        _currentUserService = currentUserService;
      }

      public async Task<long> Handle(CreateChatMessageCommand request, CancellationToken cancellationToken) {
        var recepientId = request.RecepientId;
        if (!recepientId.HasValue && request.RequestId.HasValue) {
          var requestDb = await _context.Requests.FirstOrDefaultAsync(x => x.Id == request.RequestId);
          recepientId = requestDb.ClientId;
        }

        if (!recepientId.HasValue) {
          throw new ValidationException("Не верно указан получатель");
        }

        var entity = new ChatMessage {
          CreateDateUtc = _dateService.GetDate(),
          SenderId = _currentUserService.UserId.Value,
          RecepientId = recepientId.Value,
          RequestId = request.RequestId,
          Text = request.Text,
        };

        await _context.ChatMessages.AddAsync(entity);
        await _context.SaveChangesAsync();
        return entity.Id;
      }
    }
  }
}
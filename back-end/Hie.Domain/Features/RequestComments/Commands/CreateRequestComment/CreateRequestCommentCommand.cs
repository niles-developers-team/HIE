using Hie.DB.Entities;
using Hie.Domain.Enums;
using Hie.Domain.Repositories;
using Hie.Domain.Services;
using MediatR;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace Hie.Domain.Features.RequestComments.Commands.CreateRequestComment {
  public class CreateRequestCommentCommand: IRequest<long> {
    public long? ParentId { get; set; }
    public string Text { get; set; }

    public class CreateRequestCommentCommandHandler: IRequestHandler<CreateRequestCommentCommand, long> {
      private readonly IAppDbContext _context;
      private readonly ICurrentUserService _currentUserService;
      private readonly IDateService _dateService;

      public CreateRequestCommentCommandHandler(IAppDbContext context, IDateService dateService, ICurrentUserService currentUserService) {
        _context = context;
        _dateService = dateService;
        _currentUserService = currentUserService;
      }

      public async Task<long> Handle(CreateRequestCommentCommand request, CancellationToken cancellationToken) {
        var entity = new RequestComment {
          CreateDateUtc = _dateService.GetDate(),
          UserId = _currentUserService.UserId.Value,
          ParentId = request.ParentId,
          Text = request.Text,
        };

        await _context.RequestComments.AddAsync(entity);
        await _context.SaveChangesAsync();
        return entity.Id;
      }
    }
  }
}
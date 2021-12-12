using Hie.DB.Entities;
using Hie.Domain.Enums;
using Hie.Domain.Repositories;
using Hie.Domain.Services;
using MediatR;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace Hie.Domain.Features.Requests.Commands.CreateRequest {
  public class CreateRequestCommand: IRequest<long> {
    public decimal TotalAmount { get; set; }
    public string Description { get; set; }
    public DateTime DeadlineDate { get; set; }
    public RequestPriority RequestPriority { get; set; }

    public class CreateRequestCommandHandler: IRequestHandler<CreateRequestCommand, long> {
      private readonly IAppDbContext _context;
      private readonly ICurrentUserService _currentUserService;
      private readonly IDateService _dateService;

      public CreateRequestCommandHandler(IAppDbContext context, IDateService dateService, ICurrentUserService currentUserService) {
        _context = context;
        _dateService = dateService;
        _currentUserService = currentUserService;
      }

      public async Task<long> Handle(CreateRequestCommand request, CancellationToken cancellationToken) {
        var entity = new Request {
          CreateDateUtc = _dateService.GetDate(),
          ClientId = _currentUserService.UserId.Value,
          Amount = 0,
          RequestStatus = (int)RequestStatus.Moderation,
          Description = request.Description,
          TotalAmount = request.TotalAmount,
          DeadlineDateUtc = _dateService.ToUtcDate(request.DeadlineDate),
        };

        await _context.Requests.AddAsync(entity);
        await _context.SaveChangesAsync();
        return entity.Id;
      }
    }
  }
}
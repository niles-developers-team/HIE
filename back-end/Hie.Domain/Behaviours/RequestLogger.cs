using Hie.Domain.Services;
using MediatR.Pipeline;
using Microsoft.Extensions.Logging;
using System.Threading;
using System.Threading.Tasks;

namespace Hie.Domain.Behaviours {
  public class RequestLogger<TRequest>: IRequestPreProcessor<TRequest> {
    private readonly ILogger _logger;
    private readonly ICurrentUserService _currentUserService;

    public RequestLogger(ILogger<TRequest> logger, ICurrentUserService currentUserService) {
      _logger = logger;
      _currentUserService = currentUserService;
    }

    public async Task Process(TRequest request, CancellationToken cancellationToken) {
      var requestName = typeof(TRequest).Name;
      var userId = _currentUserService.UserId;

      _logger.LogInformation("CleanArchitecture Request: {Name} {@UserId} {@Request}",
          requestName, userId, request);
    }
  }
}

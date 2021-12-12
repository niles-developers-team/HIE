using Hie.Domain.Services;
using MediatR;
using Microsoft.Extensions.Logging;
using System.Diagnostics;
using System.Threading;
using System.Threading.Tasks;

namespace Hie.Domain.Behaviours {
  public class RequestPerformanceBehaviour<TRequest, TResponse>: IPipelineBehavior<TRequest, TResponse> {
    private readonly Stopwatch _timer;
    private readonly ILogger<TRequest> _logger;
    private readonly ICurrentUserService _currentUserService;

    public RequestPerformanceBehaviour(
        ILogger<TRequest> logger,
        ICurrentUserService currentUserService) {
      _timer = new Stopwatch();

      _logger = logger;
      _currentUserService = currentUserService;
    }

    public async Task<TResponse> Handle(TRequest request, CancellationToken cancellationToken, RequestHandlerDelegate<TResponse> next) {
      _timer.Start();

      var response = await next();

      _timer.Stop();

      var elapsedMilliseconds = _timer.ElapsedMilliseconds;

      if (elapsedMilliseconds > 500) {
        //var requestName = typeof(TRequest).Name;
        //var userId = _currentUserService.UserId;
        //var userName = await _identityService.GetUserNameAsync(userId);

        //_logger.LogWarning("CleanArchitecture Long Running Request: {Name} ({ElapsedMilliseconds} milliseconds) {@UserId} {@UserName} {@Request}",
        //    requestName, elapsedMilliseconds, userId, userName, request);
      }

      return response;
    }
  }
}

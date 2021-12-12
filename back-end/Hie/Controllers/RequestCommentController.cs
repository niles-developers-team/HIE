using Hie.Domain.Features.RequestComments.Commands.CreateRequestComment;
using Hie.Domain.Features.RequestComments.Queries.CommentsForRequest;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Hie.API.Controllers {
  [Authorize]
  [ApiController]
  [Route("[controller]")]
  public class RequestCommentController: ApiController {

    public RequestCommentController() {
    }

    [HttpGet("{requestId}")]
    public async Task<ActionResult<IReadOnlyCollection<CommentForRequestVm>>> Comments(int requestId) {
      var list = await Mediator.Send(new CommentsForRequestQuery {
        RequestId = requestId,
      });
      return Ok(list);
    }

    [HttpPost]
    public async Task<ActionResult<long>> Create(CreateRequestCommentCommand command) {
      return await Mediator.Send(command);
    }
  }
}
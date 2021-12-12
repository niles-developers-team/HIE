using Hie.Domain.Features.ChatMessages.Commands.CreateChatMessage;
using Hie.Domain.Features.ChatMessages.Queries.ChatsQuery;
using Hie.Domain.Features.ChatMessages.Queries.DetailChat;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Hie.API.Controllers {
  [Authorize]
  [ApiController]
  [Route("[controller]")]
  public class ChatMessageController: ApiController {

    public ChatMessageController() {
    }

    [HttpGet("chats")]
    public async Task<ActionResult<IReadOnlyCollection<ChatVm>>> Comments() {
      var list = await Mediator.Send(new ChatsQuery());
      return Ok(list);
    }

    [HttpGet("chat")]
    public async Task<ActionResult<IReadOnlyCollection<ChatMessageVm>>> Comments(long recepientId, long? requestId) {
      var list = await Mediator.Send(new DetailChatQuery { RecepeintId = recepientId, RequestId = requestId });
      return Ok(list);
    }

    [HttpPost]
    public async Task<ActionResult<long>> Create(CreateChatMessageCommand command) {
      return await Mediator.Send(command);
    }
  }
}
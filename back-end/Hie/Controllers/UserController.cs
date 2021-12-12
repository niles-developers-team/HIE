using Hie.Domain.Features.Profile.Command.CreateUserCommand;
using Hie.Domain.Features.Profile.Command.FollowCommand;
using Hie.Domain.Features.Profile.Command.SignInCommand;
using Hie.Domain.Features.Profile.Command.SignInCommand.ViewModels;
using Hie.Domain.Features.Profile.Query;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace Hie.API.Controllers {
  [ApiController]
  [Route("[controller]")]
  public class UserController: ApiController {

    public UserController() {
    }

    [HttpPost("signIn")]
    public async Task<ActionResult<UserVm>> SignInAccount(SignInCommand command) {
      return await Mediator.Send(command);
    }

    [HttpPost("signUp/client")]
    public async Task<ActionResult<long>> CreateClientAccount(CreateClientCommand command) {
      return await Mediator.Send(command);
    }

    [HttpPost("signUp/benefactor")]
    public async Task<ActionResult<long>> CreateBenefactorAccount(CreateBenefactorCommand command) {
      return await Mediator.Send(command);
    }

    [Authorize]
    [HttpGet("user")]
    public async Task<ActionResult<UserVm>> Follow() {
      return await Mediator.Send(new UserByIdQuery());
    }

    [Authorize]
    [HttpPost("follow/{followedId}")]
    public async Task<ActionResult> Follow(long followedId) {
      await Mediator.Send(new UserFollowCommand {
        FollowedUserId = followedId,
      });
      return Ok();
    }
  }
}
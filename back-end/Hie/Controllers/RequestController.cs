using Hie.DB.Entities;
using Hie.Domain.Enums;
using Hie.Domain.Features.AutoPaymentFeature.Queries;
using Hie.Domain.Features.Requests.Commands.ApproveRequest;
using Hie.Domain.Features.Requests.Commands.CloseRequest;
using Hie.Domain.Features.Requests.Commands.CreateRequest;
using Hie.Domain.Features.Requests.Commands.UpdateRequest;
using Hie.Domain.Features.Requests.Queries.BenefactorRequest;
using Hie.Domain.Features.Requests.Queries.MyRequest;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Hie.API.Controllers {
  [Authorize]
  [ApiController]
  [Route("[controller]")]
  public class RequestController: ApiController {

    public RequestController() {
    }

    [HttpGet("my/all")]
    public async Task<ActionResult<IReadOnlyCollection<MyRequestVm>>> MyRequests() {
      var list = await Mediator.Send(new MyRequestsQuery {
        RequestStatus = null,
      });
      return Ok(list);
    }

    [HttpGet("my/byStatus")]
    public async Task<ActionResult<IReadOnlyCollection<MyAutoPaymentBenefactorVm>>> MyRequestsByStatus(RequestStatus status) {
      var list = await Mediator.Send(new MyRequestsQuery { RequestStatus = status });
      return Ok(list);
    }

    [HttpGet("benefactor")]
    public async Task<ActionResult<IReadOnlyCollection<BenefactorRequestVm>>> MyRequestsForBenefactor() {
      var list = await Mediator.Send(new BenefactorRequestsQuery());
      return Ok(list);
    }

    [HttpPost]
    public async Task<ActionResult<long>> Create(CreateRequestCommand command) {
      return await Mediator.Send(command);
    }

    [HttpPut("approve")]
    public async Task<ActionResult> Approve(ApproveRequestCommand command) {
      await Mediator.Send(command);
      return Ok();
    }

    [HttpPut("close")]
    public async Task<ActionResult> Close(CloseRequestCommand command) {
      await Mediator.Send(command);
      return Ok();
    }

    [HttpPut]
    public async Task<ActionResult<long>> Update(UpdateRequestCommand command) {
      return await Mediator.Send(command);
    }
  }
}
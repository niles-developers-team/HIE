using Hie.DB.Entities;
using Hie.Domain.Features.AutoPaymentFeature.Commands.CancelAutoPayment;
using Hie.Domain.Features.AutoPaymentFeature.Commands.CreateAutoPayment;
using Hie.Domain.Features.AutoPaymentFeature.Commands.DeleteAutoPayment;
using Hie.Domain.Features.AutoPaymentFeature.Commands.UpdateAutoPayment;
using Hie.Domain.Features.AutoPaymentFeature.Queries;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Hie.API.Controllers {
  [Authorize(nameof(Benefactor))]
  [ApiController]
  [Route("[controller]")]
  public class PaymentController: ApiController {

    public PaymentController() {
    }

    [HttpGet("my/auto/all")]
    public async Task<ActionResult<IReadOnlyCollection<MyAutoPaymentBenefactorVm>>> MyAutoPayments() {
      var list = await Mediator.Send(new MyAutoPaymentQuery{
        PaymentStatus = MyAutoPaymentQuery.AutoPaymentStatus.All,
      });
      return Ok(list);
    }

    [HttpGet("my/auto/active")]
    public async Task<ActionResult<IReadOnlyCollection<MyAutoPaymentBenefactorVm>>> MyActiveAutoPayments() {
      var list = await Mediator.Send(new MyAutoPaymentQuery{
        PaymentStatus = MyAutoPaymentQuery.AutoPaymentStatus.Active,
      });
      return Ok(list);
    }

    [HttpGet("my/auto/cancel")]
    public async Task<ActionResult<IReadOnlyCollection<MyAutoPaymentBenefactorVm>>> MyCancelAutoPayments() {
      var list = await Mediator.Send(new MyAutoPaymentQuery{
        PaymentStatus = MyAutoPaymentQuery.AutoPaymentStatus.Cancel,
      });
      return Ok(list);
    }

    [HttpPost]
    public async Task<ActionResult<long>> Create(CreateAutoPaymentCommand command) {
      return await Mediator.Send(command);
    }

    [HttpPut("cancel")]
    public async Task<ActionResult> Cancel(CancelAutoPaymentCommand command) {
      await Mediator.Send(command);
      return Ok();
    }

    [HttpPut]
    public async Task<ActionResult<long>> Update(UpdateAutoPaymentCommand command) {
      return await Mediator.Send(command);
    }

    [HttpDelete]
    public async Task<ActionResult> Delete(DeleteAutoPaymentCommand command) {
      await Mediator.Send(command);
      return Ok();
    }
  }
}
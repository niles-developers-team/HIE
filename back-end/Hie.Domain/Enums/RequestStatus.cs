using System.ComponentModel;

namespace Hie.Domain.Enums {
  public enum RequestStatus {
    [Description("На модерации")]
    Moderation = 1,
    [Description("Подтверждено")]
    Approve = 2,
    [Description("Закрыта")]
    Close = 3,
    [Description("Отменено")]
    Canceled = 3,
  }
}
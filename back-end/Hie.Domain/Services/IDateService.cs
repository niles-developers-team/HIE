using System;

namespace Hie.Domain.Services {
  public interface IDateService {
    DateTime GetDate();
    DateTime? ToLocalDate(DateTime? date);
    DateTime ToLocalDate(DateTime date);
    DateTime? ToUtcDate(DateTime? date);
    DateTime ToUtcDate(DateTime date);
  }
}
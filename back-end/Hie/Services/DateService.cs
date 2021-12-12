using Hie.Domain.Services;
using System;

namespace Hie.API.Services {
  public class DateService: IDateService {
    private readonly ICurrentUserService _currentUserService;

    public DateService(ICurrentUserService currentUserService) {
      _currentUserService = currentUserService;
    }

    public DateTime GetDate() {
      return DateTime.UtcNow;
    }

    public DateTime? ToLocalDate(DateTime? date) {
      if (!date.HasValue) {
        return date;
      }
      return ToLocalDate(date.Value);
    }

    public DateTime ToLocalDate(DateTime date) {
      if (string.IsNullOrEmpty(_currentUserService.TimeZone)) {
        return date;
      }
      var timeZone = TimeZoneInfo.FindSystemTimeZoneById(_currentUserService.TimeZone);
      return TimeZoneInfo.ConvertTimeFromUtc(date, timeZone);
    }

    public DateTime? ToUtcDate(DateTime? date) {
      if (!date.HasValue) {
        return date;
      }
      return ToUtcDate(date.Value);
    }

    public DateTime ToUtcDate(DateTime date) {
      if (string.IsNullOrEmpty(_currentUserService.TimeZone)) {
        return date;
      }
      return date;
    }
  }
}
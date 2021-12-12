using FluentValidation.Results;
using System;
using System.Collections.Generic;
using System.Linq;

namespace Hie.Domain.Exceptions {
  public class ValidationException: Exception {
    public ValidationException()
        : this("One or more validation failures have occurred.") {
    }

    public ValidationException(string message)
        : base(message) {
      Failures = new Dictionary<string, IList<string>>();
    }

    public ValidationException(List<ValidationFailure> failures)
        : this() {
      var failureGroups = failures
          .GroupBy(e => e.PropertyName, e => e.ErrorMessage);

      foreach (var failureGroup in failureGroups) {
        var propertyName = failureGroup.Key;
        var propertyFailures = failureGroup.ToArray();

        Failures.Add(propertyName, propertyFailures);
      }
    }

    public IDictionary<string, IList<string>> Failures { get; }
  }
}

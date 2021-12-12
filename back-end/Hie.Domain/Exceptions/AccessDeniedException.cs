using System;

namespace Hie.Domain.Exceptions {
  public class AccessDeniedException: Exception {
    public AccessDeniedException()
        : this("Недостаточно прав на это действие") {
    }

    public AccessDeniedException(string message)
        : base(message) {
    }
  }
}
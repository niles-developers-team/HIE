using System;

namespace Hie.Domain.Exceptions {
  public class UnexpectedError : Exception {
    public UnexpectedError()
        : this(null) {
    }

    public UnexpectedError(string msg, Exception ex)
        : base(msg, ex) {
    }

    public UnexpectedError(Exception ex)
        : this("Упс, что-то пошло не так. Пожалуйста сообщите о проблеме в службу поддержки.", ex) {
    }
  }
}
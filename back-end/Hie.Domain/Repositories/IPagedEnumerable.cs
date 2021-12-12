using System.Collections.Generic;

namespace Hie.Domain.Repositories {
  public interface IPagedEnumerable<out T>: IEnumerable<T> {
    int TotalCount { get; }
    int PageCount { get; }
  }
}
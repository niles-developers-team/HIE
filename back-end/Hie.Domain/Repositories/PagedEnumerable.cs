using System.Collections;
using System.Collections.Generic;

namespace Hie.Domain.Repositories {
  public class PagedEnumerable<T>: IPagedEnumerable<T> {
    private readonly IEnumerable<T> _entities;
    public int TotalCount { get; private set; }
    public int PageCount { get; private set; }

    public PagedEnumerable(IEnumerable<T> entities, int totalCount, int pageCount) {
      _entities = entities;
      TotalCount = totalCount;
      PageCount = pageCount;
    }

    public IEnumerator<T> GetEnumerator() {
      return _entities.GetEnumerator();
    }

    IEnumerator IEnumerable.GetEnumerator() {
      return _entities.GetEnumerator();
    }
  }
}
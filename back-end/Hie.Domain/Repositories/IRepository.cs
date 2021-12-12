using System;
using System.Threading.Tasks;

namespace Hie.Domain.Repositories {
  public interface IRepository<T, F>: IDisposable
    where T : class
    where F : class {
    Task<PagedEnumerable<T>> GetAll(Paging paging = null, F filter = null);
    Task<T> Get(long id);
    Task<PagedEnumerable<TViewModel>> GetAll<TViewModel>(Paging paging = null, F filter = null)
      where TViewModel : class;
    Task<TViewModel> Get<TViewModel>(long id)
      where TViewModel : class;

    Task<T> Create(T item);
    Task<T> Update(long id, T item);
    Task<T> Delete(long id);
    T[] OutCreateId();
  }
}
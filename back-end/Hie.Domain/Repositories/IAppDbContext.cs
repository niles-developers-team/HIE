using Hie.DB.Entities;
using Microsoft.EntityFrameworkCore;
using System.Threading;
using System.Threading.Tasks;

namespace Hie.Domain.Repositories {
  public interface IAppDbContext {
    DbSet<User> Users { get; set; }
    DbSet<Client> Clients { get; set; }
    DbSet<Benefactor> Benefactors { get; set; }
    DbSet<BenefactorLevel> BenefactorLevels { get; set; }
    DbSet<Follow> Follows { get; set; }
    DbSet<ChatMessage> ChatMessages { get; set; }

    DbSet<AutoPaymentBenefactor> AutoPaymentBenefactors { get; set; }
    DbSet<Payment> Payments { get; set; }

    DbSet<Request> Requests { get; set; }
    DbSet<RequestComment> RequestComments { get; set; }

    Task<IAppDbContext> BeginTransaction();

    Task RollBack();
    Task<int> SaveChangesAsync(CancellationToken cancellationToken = default);
    Task CommitTransaction();
    Task SaveChangesAndCommitTransaction();
  }
}
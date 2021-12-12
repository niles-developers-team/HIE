using Microsoft.EntityFrameworkCore;
using Hie.DB.Entities;
using System.Reflection;
using Hie.Domain.Repositories;
using System.Threading.Tasks;
using System.Threading;

namespace Hie.DB {
  public class HieAppContext: DbContext, IAppDbContext {
    public DbSet<User> Users { get; set; }
    public DbSet<Client> Clients { get; set; }
    public DbSet<Benefactor> Benefactors { get; set; }
    public DbSet<BenefactorLevel> BenefactorLevels { get; set; }
    public DbSet<Follow> Follows { get; set; }
    public DbSet<ChatMessage> ChatMessages { get; set; }

    public DbSet<AutoPaymentBenefactor> AutoPaymentBenefactors { get; set; }
    public DbSet<Payment> Payments { get; set; }

    public DbSet<Request> Requests { get; set; }
    public DbSet<RequestComment> RequestComments { get; set; }

    public HieAppContext(DbContextOptions<HieAppContext> options)
        : base(options) {
    }

    protected override void OnModelCreating(ModelBuilder modelBuilder) {
      modelBuilder.ApplyConfigurationsFromAssembly(Assembly.GetExecutingAssembly());

      modelBuilder.Entity<User>().HasOne(x => x.Benefactor).WithOne(x => x.User).HasForeignKey<Benefactor>(x => x.Id).IsRequired(false);
      modelBuilder.Entity<User>().HasOne(x => x.Client).WithOne(x => x.User).HasForeignKey<Client>(x => x.Id).IsRequired(false);

      modelBuilder.Entity<Benefactor>().HasOne(x => x.Level).WithMany(x => x.Benefactors).HasForeignKey(x => x.LevelId);

      modelBuilder.Entity<Follow>().HasOne(x => x.FollowedUser).WithMany(x => x.Followeds).HasForeignKey(x => x.FollowedId);
      modelBuilder.Entity<Follow>().HasOne(x => x.FollowerUser).WithMany(x => x.Followers).HasForeignKey(x => x.FollowerId);

      modelBuilder.Entity<RequestComment>().HasOne(x => x.Request).WithMany(x => x.Comments).HasForeignKey(x => x.RequestId);

      modelBuilder.Entity<Payment>().HasOne(x => x.Benefactor).WithOne().HasForeignKey<Payment>(x => x.BenefactorId);
      modelBuilder.Entity<Payment>().HasOne(x => x.Request).WithOne().HasForeignKey<Payment>(x => x.RequestId).IsRequired(false);

      modelBuilder.Entity<AutoPaymentBenefactor>().HasOne(x => x.Benefactor).WithOne().HasForeignKey<AutoPaymentBenefactor>(x => x.BenefactorId);
      modelBuilder.Entity<AutoPaymentBenefactor>().HasOne(x => x.Client).WithOne().HasForeignKey<AutoPaymentBenefactor>(x => x.ClientId).IsRequired(false);

      modelBuilder.Entity<ChatMessage>().HasOne(x => x.Request).WithOne().HasForeignKey<ChatMessage>(x => x.RequestId);
      modelBuilder.Entity<ChatMessage>().HasOne(x => x.Recepient).WithMany().HasForeignKey(x => x.RecepientId);
      modelBuilder.Entity<ChatMessage>().HasOne(x => x.Sender).WithMany().HasForeignKey(x => x.SenderId);

      base.OnModelCreating(modelBuilder);
    }

    public async Task<IAppDbContext> BeginTransaction() {
      await Database.BeginTransactionAsync();
      return this;
    }

    public async Task RollBack() {
      await Database.RollbackTransactionAsync();
    }

    public async Task CommitTransaction() {
      await Database.CommitTransactionAsync();
    }

    public async Task SaveChangesAndCommitTransaction() {
      await CommitTransaction();
      await SaveChangesAsync(CancellationToken.None);
    }
  }
}
using Hie.DB.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Hie.DB.FluentApi {
  internal class ClientConfiguration: IEntityTypeConfiguration<Client> {
    public void Configure(EntityTypeBuilder<Client> builder) {
      builder.HasKey(x => x.Id);
      builder.Property(x => x.INN).HasMaxLength(56);
      builder.Property(x => x.Kpp).HasMaxLength(56);
      builder.Property(x => x.Ogrn).HasMaxLength(56);
      builder.Property(x => x.PersonalBankAccount).HasMaxLength(56);
    }
  }
}
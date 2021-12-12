using Hie.DB.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Hie.DB.FluentApi {
  internal class BenefactorConfiguration: IEntityTypeConfiguration<Benefactor> {
    public void Configure(EntityTypeBuilder<Benefactor> builder) {
      builder.HasKey(x => x.Id);
    }
  }
}
using Hie.DB.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Hie.DB.FluentApi {
  internal class BenefactorLevelConfiguration: IEntityTypeConfiguration<BenefactorLevel> {
    public void Configure(EntityTypeBuilder<BenefactorLevel> builder) {
      builder.HasKey(x => x.Id);
      builder.HasIndex(x => x.Order).IsUnique();
      builder.Property(x => x.LevelName).HasMaxLength(56);
    }
  }
}
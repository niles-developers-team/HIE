using Hie.DB.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Hie.DB.FluentApi {
  internal class RequestConfiguration: IEntityTypeConfiguration<Request> {
    public void Configure(EntityTypeBuilder<Request> builder) {
      builder.HasKey(x => x.Id);
      builder.Property(x => x.Description).HasMaxLength(1028);
    }
  }
}
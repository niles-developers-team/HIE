using Hie.DB.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Hie.DB.FluentApi {
  internal class RequestCommentConfiguration: IEntityTypeConfiguration<RequestComment> {
    public void Configure(EntityTypeBuilder<RequestComment> builder) {
      builder.HasKey(x => x.Id);
      builder.Property(x => x.Id).ValueGeneratedOnAdd();
      builder.Property(x => x.Text).HasMaxLength(1028);
    }
  }
}
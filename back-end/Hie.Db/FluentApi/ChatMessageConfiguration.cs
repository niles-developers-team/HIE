using Hie.DB.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Hie.DB.FluentApi {
  internal class ChatMessageConfiguration: IEntityTypeConfiguration<ChatMessage> {
    public void Configure(EntityTypeBuilder<ChatMessage> builder) {
      builder.HasKey(x => x.Id);
      builder.Property(x => x.Text).HasMaxLength(1028);
    }
  }
}
using Hie.DB.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using System;

namespace Hie.DB.FluentApi {
  internal class UserConfiguration: IEntityTypeConfiguration<User> {
    public void Configure(EntityTypeBuilder<User> builder) {
      builder.HasKey(x => x.Id);
      builder.Property(x => x.Id).ValueGeneratedOnAdd();
      builder.Property(x => x.Login).HasMaxLength(128);
      builder.Property(x => x.Email).HasMaxLength(256);
      builder.Property(x => x.Phone).HasMaxLength(20);
      builder.Property(x => x.TimeZone).HasMaxLength(128);
    }
  }
}
using Hie.DB.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using System;

namespace Hie.DB.FluentApi {
  internal class PaymentConfiguration: IEntityTypeConfiguration<Payment> {
    public void Configure(EntityTypeBuilder<Payment> builder) {
      builder.HasKey(x => x.Id);
      builder.Property(x => x.Comment).HasMaxLength(1028);
    }
  }
}
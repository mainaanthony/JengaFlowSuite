using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Api.Models;
using Api.Enums;

namespace Api.Data.Configurations
{
    public class TaxReturnConfiguration : IEntityTypeConfiguration<TaxReturn>
    {
        public void Configure(EntityTypeBuilder<TaxReturn> builder)
        {
            builder.ToTable("TaxReturns");
            builder.HasKey(t => t.Id);
            builder.Property(t => t.Period).IsRequired().HasMaxLength(50);
            builder.Property(t => t.TaxType).IsRequired();
            builder.Property(t => t.Amount).HasColumnType("decimal(18,2)");
            builder.Property(t => t.Status).IsRequired();
            builder.Property(tr => tr.DueDate).IsRequired();
            builder.Property(tr => tr.ReferenceNumber).HasMaxLength(100);
            builder.Property(tr => tr.CreatedAt).IsRequired();

            builder.HasOne(tr => tr.SubmittedByUser)
                .WithMany()
                .HasForeignKey(tr => tr.SubmittedByUserId)
                .OnDelete(DeleteBehavior.SetNull);
        }
    }
}

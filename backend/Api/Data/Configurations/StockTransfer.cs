using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Api.Models;
using Api.Enums;

namespace Api.Data.Configurations
{
    public class StockTransferConfiguration : IEntityTypeConfiguration<StockTransfer>
    {
        public void Configure(EntityTypeBuilder<StockTransfer> builder)
        {
            builder.ToTable("StockTransfers");
            builder.HasKey(st => st.Id);
            builder.Property(st => st.TransferNumber).IsRequired().HasMaxLength(50);
            builder.HasIndex(st => st.TransferNumber).IsUnique();
            builder.Property(st => st.Status).IsRequired();
            builder.Property(st => st.RequestedDate).IsRequired();
            builder.Property(st => st.Notes).HasMaxLength(1000);
            builder.Property(st => st.CreatedAt).IsRequired();

            builder.HasOne(st => st.FromBranch)
                .WithMany(b => b.StockTransfersFrom)
                .HasForeignKey(st => st.FromBranchId)
                .OnDelete(DeleteBehavior.Restrict);

            builder.HasOne(st => st.ToBranch)
                .WithMany(b => b.StockTransfersTo)
                .HasForeignKey(st => st.ToBranchId)
                .OnDelete(DeleteBehavior.Restrict);

            builder.HasOne(st => st.RequestedByUser)
                .WithMany(u => u.StockTransfersRequested)
                .HasForeignKey(st => st.RequestedByUserId)
                .OnDelete(DeleteBehavior.Restrict);

            builder.HasOne(st => st.ApprovedByUser)
                .WithMany(u => u.StockTransfersApproved)
                .HasForeignKey(st => st.ApprovedByUserId)
                .OnDelete(DeleteBehavior.Restrict);

            builder.HasMany(st => st.Items)
                .WithOne(sti => sti.StockTransfer)
                .HasForeignKey(sti => sti.StockTransferId)
                .OnDelete(DeleteBehavior.Cascade);
        }
    }
}

using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Api.Models;

namespace Api.Data.Configurations
{
    public class StockTransferItemConfiguration : IEntityTypeConfiguration<StockTransferItem>
    {
        public void Configure(EntityTypeBuilder<StockTransferItem> builder)
        {
            builder.ToTable("StockTransferItems");
            builder.HasKey(sti => sti.Id);
            builder.Property(sti => sti.QuantityRequested).IsRequired();
            builder.Property(sti => sti.CreatedAt).IsRequired();

            builder.HasOne(sti => sti.Product)
                .WithMany()
                .HasForeignKey(sti => sti.ProductId)
                .OnDelete(DeleteBehavior.Restrict);
        }
    }
}

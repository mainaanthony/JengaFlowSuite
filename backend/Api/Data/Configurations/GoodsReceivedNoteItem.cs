using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Api.Models;

namespace Api.Data.Configurations
{
    public class GoodsReceivedNoteItemConfiguration : IEntityTypeConfiguration<GoodsReceivedNoteItem>
    {
        public void Configure(EntityTypeBuilder<GoodsReceivedNoteItem> builder)
        {
            builder.ToTable("GoodsReceivedNoteItems");
            builder.HasKey(item => item.Id);
            builder.Property(item => item.QuantityOrdered).IsRequired();
            builder.Property(item => item.QuantityReceived).IsRequired();
            builder.Property(item => item.Remarks).HasMaxLength(500);
            builder.Property(item => item.CreatedAt).IsRequired();

            builder.HasOne(item => item.Product)
                .WithMany()
                .HasForeignKey(item => item.ProductId)
                .OnDelete(DeleteBehavior.Restrict);
        }
    }
}

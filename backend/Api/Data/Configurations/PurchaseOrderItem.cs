using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Api.Models;

namespace Api.Data.Configurations
{
    public class PurchaseOrderItemConfiguration : IEntityTypeConfiguration<PurchaseOrderItem>
    {
        public void Configure(EntityTypeBuilder<PurchaseOrderItem> builder)
        {
            builder.ToTable("PurchaseOrderItems");
            builder.HasKey(poi => poi.Id);
            builder.Property(poi => poi.Quantity).IsRequired();
            builder.Property(poi => poi.UnitPrice).HasColumnType("decimal(18,2)");
            builder.Property(poi => poi.TotalPrice).HasColumnType("decimal(18,2)");
            builder.Property(poi => poi.CreatedAt).IsRequired();

            builder.HasOne(poi => poi.Product)
                .WithMany(p => p.PurchaseOrderItems)
                .HasForeignKey(poi => poi.ProductId)
                .OnDelete(DeleteBehavior.Restrict);
        }
    }
}

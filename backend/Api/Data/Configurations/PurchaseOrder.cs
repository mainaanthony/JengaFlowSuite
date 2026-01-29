using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Api.Models;
using Api.Enums;

namespace Api.Data.Configurations
{
    public class PurchaseOrderConfiguration : IEntityTypeConfiguration<PurchaseOrder>
    {
        public void Configure(EntityTypeBuilder<PurchaseOrder> builder)
        {
            builder.ToTable("PurchaseOrders");
            builder.HasKey(po => po.Id);
            builder.Property(po => po.PONumber).IsRequired().HasMaxLength(50);
            builder.HasIndex(po => po.PONumber).IsUnique();
            builder.Property(po => po.TotalAmount).HasColumnType("decimal(18,2)");
            builder.Property(po => po.Status).IsRequired();
            builder.Property(po => po.ExpectedDeliveryDate).IsRequired();
            builder.Property(po => po.Notes).HasMaxLength(1000);
            builder.Property(po => po.CreatedAt).IsRequired();

            builder.HasOne(po => po.Supplier)
                .WithMany(s => s.PurchaseOrders)
                .HasForeignKey(po => po.SupplierId)
                .OnDelete(DeleteBehavior.Restrict);

            builder.HasOne(po => po.CreatedByUser)
                .WithMany(u => u.PurchaseOrdersCreated)
                .HasForeignKey(po => po.CreatedByUserId)
                .OnDelete(DeleteBehavior.Restrict);

            builder.HasOne(po => po.ApprovedByUser)
                .WithMany(u => u.PurchaseOrdersApproved)
                .HasForeignKey(po => po.ApprovedByUserId)
                .OnDelete(DeleteBehavior.Restrict);

            builder.HasMany(po => po.Items)
                .WithOne(poi => poi.PurchaseOrder)
                .HasForeignKey(poi => poi.PurchaseOrderId)
                .OnDelete(DeleteBehavior.Cascade);

            builder.HasMany(po => po.GoodsReceivedNotes)
                .WithOne(grn => grn.PurchaseOrder)
                .HasForeignKey(grn => grn.PurchaseOrderId)
                .OnDelete(DeleteBehavior.Restrict);
        }
    }
}

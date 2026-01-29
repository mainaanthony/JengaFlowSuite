using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Api.Models;

namespace Api.Data.Configurations
{
    public class InventoryConfiguration : IEntityTypeConfiguration<Inventory>
    {
        public void Configure(EntityTypeBuilder<Inventory> builder)
        {
            builder.ToTable("Inventory");
            builder.HasKey(i => i.Id);
            builder.Property(i => i.Quantity).IsRequired();
            builder.Property(i => i.ReorderLevel).IsRequired().HasDefaultValue(10);
            builder.Property(i => i.MaxStockLevel).IsRequired().HasDefaultValue(100);
            builder.Property(i => i.LastRestocked).IsRequired();
            builder.Property(i => i.CreatedAt).IsRequired();

            builder.HasIndex(i => new { i.ProductId, i.BranchId }).IsUnique();

            builder.HasOne(i => i.Product)
                .WithMany(p => p.InventoryRecords)
                .HasForeignKey(i => i.ProductId)
                .OnDelete(DeleteBehavior.Restrict);

            builder.HasOne(i => i.Branch)
                .WithMany(b => b.InventoryRecords)
                .HasForeignKey(i => i.BranchId)
                .OnDelete(DeleteBehavior.Restrict);
        }
    }
}

using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Api.Models;

namespace Api.Data.Configurations
{
    public class SupplierConfiguration : IEntityTypeConfiguration<Supplier>
    {
        public void Configure(EntityTypeBuilder<Supplier> builder)
        {
            builder.ToTable("Suppliers");
            builder.HasKey(s => s.Id);
            builder.Property(s => s.Name).IsRequired().HasMaxLength(200);
            builder.Property(s => s.ContactPerson).HasMaxLength(100);
            builder.Property(s => s.Phone).IsRequired().HasMaxLength(20);
            builder.Property(s => s.Email).IsRequired().HasMaxLength(100);
            builder.HasIndex(s => s.Email).IsUnique();
            builder.Property(s => s.Address).HasMaxLength(500);
            builder.Property(s => s.Category).HasMaxLength(100);
            builder.Property(s => s.Rating).HasColumnType("decimal(3,2)");
            builder.Property(s => s.IsActive).IsRequired().HasDefaultValue(true);
            builder.Property(s => s.CreatedAt).IsRequired();

            builder.HasMany(s => s.PurchaseOrders)
                .WithOne(po => po.Supplier)
                .HasForeignKey(po => po.SupplierId)
                .OnDelete(DeleteBehavior.Restrict);
        }
    }
}

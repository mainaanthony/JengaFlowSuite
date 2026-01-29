using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Api.Models;
using Api.Enums;

namespace Api.Data.Configurations
{
    public class DeliveryConfiguration : IEntityTypeConfiguration<Delivery>
    {
        public void Configure(EntityTypeBuilder<Delivery> builder)
        {
            builder.ToTable("Deliveries");
            builder.HasKey(d => d.Id);
            builder.Property(d => d.DeliveryNumber).IsRequired().HasMaxLength(50);
            builder.HasIndex(d => d.DeliveryNumber).IsUnique();
            builder.Property(d => d.DeliveryAddress).IsRequired().HasMaxLength(500);
            builder.Property(d => d.ContactPhone).HasMaxLength(20);
            builder.Property(d => d.Status).IsRequired();
            builder.Property(d => d.Priority).IsRequired();
            builder.Property(d => d.ScheduledDate).IsRequired();
            builder.Property(d => d.Notes).HasMaxLength(1000);
            builder.Property(d => d.CreatedAt).IsRequired();

            builder.HasOne(d => d.Sale)
                .WithMany()
                .HasForeignKey(d => d.SaleId)
                .OnDelete(DeleteBehavior.SetNull);

            builder.HasOne(d => d.Driver)
                .WithMany(dr => dr.Deliveries)
                .HasForeignKey(d => d.DriverId)
                .OnDelete(DeleteBehavior.Restrict);

            builder.HasMany(d => d.Items)
                .WithOne(di => di.Delivery)
                .HasForeignKey(di => di.DeliveryId)
                .OnDelete(DeleteBehavior.Cascade);
        }
    }
}

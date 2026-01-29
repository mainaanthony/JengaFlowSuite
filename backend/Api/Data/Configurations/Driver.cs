using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Api.Models;

namespace Api.Data.Configurations
{
    public class DriverConfiguration : IEntityTypeConfiguration<Driver>
    {
        public void Configure(EntityTypeBuilder<Driver> builder)
        {
            builder.ToTable("Drivers");
            builder.HasKey(d => d.Id);
            builder.Property(d => d.Name).IsRequired().HasMaxLength(200);
            builder.Property(d => d.Phone).IsRequired().HasMaxLength(20);
            builder.Property(d => d.LicenseNumber).HasMaxLength(50);
            builder.Property(d => d.Vehicle).IsRequired().HasMaxLength(100);
            builder.Property(d => d.VehicleRegistration).HasMaxLength(50);
            builder.Property(d => d.Status).IsRequired().HasMaxLength(50).HasDefaultValue("Available");
            builder.Property(d => d.Rating).HasColumnType("decimal(3,2)");
            builder.Property(d => d.IsActive).IsRequired().HasDefaultValue(true);
            builder.Property(d => d.CreatedAt).IsRequired();

            builder.HasMany(d => d.Deliveries)
                .WithOne(del => del.Driver)
                .HasForeignKey(del => del.DriverId)
                .OnDelete(DeleteBehavior.Restrict);
        }
    }
}

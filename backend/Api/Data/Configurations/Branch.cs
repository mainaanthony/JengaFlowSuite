using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Api.Models;

namespace Api.Data.Configurations
{
    public class BranchConfiguration : IEntityTypeConfiguration<Branch>
    {
        public void Configure(EntityTypeBuilder<Branch> builder)
        {
            builder.ToTable("Branches");

            builder.HasKey(b => b.Id);

            builder.Property(b => b.Name)
                .IsRequired()
                .HasMaxLength(200);

            builder.Property(b => b.Code)
                .IsRequired()
                .HasMaxLength(50);

            builder.HasIndex(b => b.Code)
                .IsUnique();

            builder.Property(b => b.Address)
                .HasMaxLength(500);

            builder.Property(b => b.City)
                .HasMaxLength(100);

            builder.Property(b => b.Phone)
                .HasMaxLength(20);

            builder.Property(b => b.Email)
                .HasMaxLength(100);

            builder.Property(b => b.IsActive)
                .IsRequired()
                .HasDefaultValue(true);

            builder.Property(b => b.CreatedAt)
                .IsRequired();

            // Navigation
            builder.HasMany(b => b.Users)
                .WithOne(u => u.Branch)
                .HasForeignKey(u => u.BranchId)
                .OnDelete(DeleteBehavior.Restrict);
        }
    }
}

using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Api.Models;

namespace Api.Data.Configurations
{
    public class DeliveryItemConfiguration : IEntityTypeConfiguration<DeliveryItem>
    {
        public void Configure(EntityTypeBuilder<DeliveryItem> builder)
        {
            builder.ToTable("DeliveryItems");
            builder.HasKey(di => di.Id);
            builder.Property(di => di.Quantity).IsRequired();
            builder.Property(di => di.CreatedAt).IsRequired();

            builder.HasOne(di => di.Product)
                .WithMany()
                .HasForeignKey(di => di.ProductId)
                .OnDelete(DeleteBehavior.Restrict);
        }
    }
}

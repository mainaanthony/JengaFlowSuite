using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Api.Models;
using Api.Enums;

namespace Api.Data.Configurations
{
    public class GoodsReceivedNoteConfiguration : IEntityTypeConfiguration<GoodsReceivedNote>
    {
        public void Configure(EntityTypeBuilder<GoodsReceivedNote> builder)
        {
            builder.ToTable("GoodsReceivedNotes");
            builder.HasKey(g => g.Id);
            builder.Property(g => g.GRNNumber).IsRequired().HasMaxLength(50);
            builder.HasIndex(g => g.GRNNumber).IsUnique();
            builder.Property(g => g.Status).IsRequired();
            builder.Property(grn => grn.Notes).HasMaxLength(1000);
            builder.Property(grn => grn.CreatedAt).IsRequired();

            builder.HasOne(grn => grn.ReceivedByUser)
                .WithMany()
                .HasForeignKey(grn => grn.ReceivedByUserId)
                .OnDelete(DeleteBehavior.Restrict);

            builder.HasMany(grn => grn.Items)
                .WithOne(item => item.GoodsReceivedNote)
                .HasForeignKey(item => item.GoodsReceivedNoteId)
                .OnDelete(DeleteBehavior.Cascade);
        }
    }
}

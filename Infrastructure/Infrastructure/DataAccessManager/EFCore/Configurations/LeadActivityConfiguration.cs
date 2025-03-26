using Domain.Entities;
using Infrastructure.DataAccessManager.EFCore.Common;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using static Domain.Common.Constants;

namespace Infrastructure.DataAccessManager.EFCore.Configurations;

public class LeadActivityConfiguration : BaseEntityConfiguration<LeadActivity>
{
    public override void Configure(EntityTypeBuilder<LeadActivity> builder)
    {
        base.Configure(builder);

        builder.Property(x => x.LeadId).HasMaxLength(IdConsts.MaxLength).IsRequired(false);

        builder.Property(x => x.Number).HasMaxLength(CodeConsts.MaxLength).IsRequired(false);
        builder.Property(x => x.Summary).HasMaxLength(NameConsts.MaxLength).IsRequired(false);
        builder.Property(x => x.Description).HasMaxLength(DescriptionConsts.MaxLength).IsRequired(false);
        builder.Property(x => x.FromDate).IsRequired(false);
        builder.Property(x => x.ToDate).IsRequired(false);
        builder.Property(x => x.Type).HasConversion<string>().IsRequired(false);
        builder.Property(x => x.AttachmentName).HasMaxLength(NameConsts.MaxLength).IsRequired(false);

        builder.HasIndex(e => e.Number);
    }
}
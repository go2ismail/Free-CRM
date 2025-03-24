using Domain.Entities;
using Infrastructure.DataAccessManager.EFCore.Common;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using static Domain.Common.Constants;

namespace Infrastructure.DataAccessManager.EFCore.Configurations;

public class CampaignConfiguration : BaseEntityConfiguration<Campaign>
{
    public override void Configure(EntityTypeBuilder<Campaign> builder)
    {
        base.Configure(builder);

        builder.Property(x => x.Number).HasMaxLength(CodeConsts.MaxLength).IsRequired(true);
        builder.Property(x => x.Title).HasMaxLength(NameConsts.MaxLength).IsRequired(true);
        builder.Property(x => x.Description).HasMaxLength(DescriptionConsts.MaxLength).IsRequired(false);
        builder.Property(x => x.TargetRevenueAmount).IsRequired(true);
        builder.Property(x => x.CampaignDateStart).IsRequired(true);
        builder.Property(x => x.CampaignDateFinish).IsRequired(true);
        builder.Property(x => x.Status).IsRequired(true);
        builder.Property(x => x.SalesTeamId).HasMaxLength(IdConsts.MaxLength).IsRequired(true);

        builder.HasIndex(e => e.Number);
        builder.HasIndex(e => e.Title);
    }
}
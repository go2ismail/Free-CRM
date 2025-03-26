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

        builder.Property(x => x.Number).HasMaxLength(CodeConsts.MaxLength).IsRequired(false);
        builder.Property(x => x.Title).HasMaxLength(NameConsts.MaxLength).IsRequired(false);
        builder.Property(x => x.Description).HasMaxLength(DescriptionConsts.MaxLength).IsRequired(false);
        builder.Property(x => x.TargetRevenueAmount).IsRequired(false);
        builder.Property(x => x.CampaignDateStart).IsRequired(false);
        builder.Property(x => x.CampaignDateFinish).IsRequired(false);
        builder.Property(x => x.Status).IsRequired(false);
        builder.Property(x => x.SalesTeamId).HasMaxLength(IdConsts.MaxLength).IsRequired(false);

        builder.HasIndex(e => e.Number);
        builder.HasIndex(e => e.Title);
    }
}
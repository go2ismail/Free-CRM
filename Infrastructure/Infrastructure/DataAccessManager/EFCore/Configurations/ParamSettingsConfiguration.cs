using Domain.Entities;
using Infrastructure.DataAccessManager.EFCore.Common;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using static Domain.Common.Constants;

namespace Infrastructure.DataAccessManager.EFCore.Configurations;

public class ParamSettingsConfiguration : BaseEntityConfiguration<ParamSettings>
{
    public override void Configure(EntityTypeBuilder<ParamSettings> builder)
    {
        base.Configure(builder);

        builder.Property(x => x.ParamName).HasMaxLength(NameConsts.MaxLength).IsRequired(false);
        builder.Property(x => x.ParamValue).IsRequired(false);
        
    }
}
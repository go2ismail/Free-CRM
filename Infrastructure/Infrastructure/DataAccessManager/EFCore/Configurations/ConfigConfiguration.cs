using Domain.Entities;
using Infrastructure.DataAccessManager.EFCore.Common;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using static Domain.Common.Constants;

namespace Infrastructure.DataAccessManager.EFCore.Configurations;

public class ConfigConfiguration : BaseEntityConfiguration<Config>
{
    public override void Configure(EntityTypeBuilder<Config> builder)
    {
        base.Configure(builder);

        builder.Property(x => x.Name).HasMaxLength(NameConsts.MaxLength).IsRequired();
        builder.Property(x => x.Value).HasMaxLength(500).IsRequired();

        builder.HasIndex(e => e.Name);
    }
}
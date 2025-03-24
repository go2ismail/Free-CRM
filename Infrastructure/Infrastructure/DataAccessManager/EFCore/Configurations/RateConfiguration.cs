using Domain.Entities;
using Infrastructure.DataAccessManager.EFCore.Common;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using static Domain.Common.Constants;

namespace Infrastructure.DataAccessManager.EFCore.Configurations;

public class RateConfiguration : BaseEntityConfiguration<Rate>
{
    public override void Configure(EntityTypeBuilder<Rate> builder)
    {
        base.Configure(builder);

        builder.Property(x => x.Ratio).IsRequired(true);
        builder.Property(x => x.ValidateDate).IsRequired(true);
        builder.Property(x => x.ExpiringeDate).IsRequired(true);
        
    }
}
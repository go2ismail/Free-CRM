using Domain.Entities;
using Infrastructure.DataAccessManager.EFCore.Common;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using static Domain.Common.Constants;

namespace Infrastructure.DataAccessManager.EFCore.Configurations;

public class LeadContactConfiguration : BaseEntityConfiguration<LeadContact>
{
    public override void Configure(EntityTypeBuilder<LeadContact> builder)
    {
        base.Configure(builder);

        builder.Property(x => x.LeadId).HasMaxLength(IdConsts.MaxLength).IsRequired(false);

        builder.Property(x => x.Number).HasMaxLength(CodeConsts.MaxLength).IsRequired(false);
        builder.Property(x => x.FullName).HasMaxLength(NameConsts.MaxLength).IsRequired(false);
        builder.Property(x => x.Description).HasMaxLength(DescriptionConsts.MaxLength).IsRequired(false);
        builder.Property(x => x.AddressStreet).HasMaxLength(NameConsts.MaxLength).IsRequired(false);
        builder.Property(x => x.AddressCity).HasMaxLength(NameConsts.MaxLength).IsRequired(false);
        builder.Property(x => x.AddressState).HasMaxLength(NameConsts.MaxLength).IsRequired(false);
        builder.Property(x => x.AddressZipCode).HasMaxLength(NameConsts.MaxLength).IsRequired(false);
        builder.Property(x => x.AddressCountry).HasMaxLength(NameConsts.MaxLength).IsRequired(false);
        builder.Property(x => x.PhoneNumber).HasMaxLength(NameConsts.MaxLength).IsRequired(false);
        builder.Property(x => x.FaxNumber).HasMaxLength(NameConsts.MaxLength).IsRequired(false);
        builder.Property(x => x.MobileNumber).HasMaxLength(NameConsts.MaxLength).IsRequired(false);
        builder.Property(x => x.Email).HasMaxLength(EmailConsts.MaxLength).IsRequired(false);
        builder.Property(x => x.Website).HasMaxLength(NameConsts.MaxLength).IsRequired(false);
        builder.Property(x => x.WhatsApp).HasMaxLength(NameConsts.MaxLength).IsRequired(false);
        builder.Property(x => x.LinkedIn).HasMaxLength(NameConsts.MaxLength).IsRequired(false);
        builder.Property(x => x.Facebook).HasMaxLength(NameConsts.MaxLength).IsRequired(false);
        builder.Property(x => x.Twitter).HasMaxLength(NameConsts.MaxLength).IsRequired(false);
        builder.Property(x => x.Instagram).HasMaxLength(NameConsts.MaxLength).IsRequired(false);
        builder.Property(x => x.AvatarName).HasMaxLength(NameConsts.MaxLength).IsRequired(false);

        builder.HasIndex(e => e.Number);
        builder.HasIndex(e => e.FullName);
    }
}
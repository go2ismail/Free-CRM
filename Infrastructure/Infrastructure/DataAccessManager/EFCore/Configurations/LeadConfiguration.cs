using Domain.Entities;
using Infrastructure.DataAccessManager.EFCore.Common;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using static Domain.Common.Constants;

namespace Infrastructure.DataAccessManager.EFCore.Configurations;

public class LeadConfiguration : BaseEntityConfiguration<Lead>
{
    public override void Configure(EntityTypeBuilder<Lead> builder)
    {
        base.Configure(builder);

        builder.Property(x => x.Number).HasMaxLength(CodeConsts.MaxLength).IsRequired(false);
        builder.Property(x => x.Title).HasMaxLength(NameConsts.MaxLength).IsRequired(false);
        builder.Property(x => x.Description).HasMaxLength(DescriptionConsts.MaxLength).IsRequired(false);
        builder.Property(x => x.CompanyName).HasMaxLength(NameConsts.MaxLength).IsRequired(false);
        builder.Property(x => x.CompanyDescription).HasMaxLength(DescriptionConsts.MaxLength).IsRequired(false);
        builder.Property(x => x.CompanyAddressStreet).HasMaxLength(NameConsts.MaxLength).IsRequired(false);
        builder.Property(x => x.CompanyAddressCity).HasMaxLength(NameConsts.MaxLength).IsRequired(false);
        builder.Property(x => x.CompanyAddressState).HasMaxLength(NameConsts.MaxLength).IsRequired(false);
        builder.Property(x => x.CompanyAddressZipCode).HasMaxLength(NameConsts.MaxLength).IsRequired(false);
        builder.Property(x => x.CompanyAddressCountry).HasMaxLength(NameConsts.MaxLength).IsRequired(false);
        builder.Property(x => x.CompanyPhoneNumber).HasMaxLength(NameConsts.MaxLength).IsRequired(false);
        builder.Property(x => x.CompanyFaxNumber).HasMaxLength(NameConsts.MaxLength).IsRequired(false);
        builder.Property(x => x.CompanyEmail).HasMaxLength(EmailConsts.MaxLength).IsRequired(false);
        builder.Property(x => x.CompanyWebsite).HasMaxLength(NameConsts.MaxLength).IsRequired(false);
        builder.Property(x => x.CompanyWhatsApp).HasMaxLength(NameConsts.MaxLength).IsRequired(false);
        builder.Property(x => x.CompanyLinkedIn).HasMaxLength(NameConsts.MaxLength).IsRequired(false);
        builder.Property(x => x.CompanyFacebook).HasMaxLength(NameConsts.MaxLength).IsRequired(false);
        builder.Property(x => x.CompanyInstagram).HasMaxLength(NameConsts.MaxLength).IsRequired(false);
        builder.Property(x => x.CompanyTwitter).HasMaxLength(NameConsts.MaxLength).IsRequired(false);
        builder.Property(x => x.DateProspecting).IsRequired(false);
        builder.Property(x => x.DateClosingEstimation).IsRequired(false);
        builder.Property(x => x.DateClosingActual).IsRequired(false);
        builder.Property(x => x.AmountTargeted).IsRequired(false);
        builder.Property(x => x.AmountClosed).IsRequired(false);
        builder.Property(x => x.BudgetScore).IsRequired(false);
        builder.Property(x => x.AuthorityScore).IsRequired(false);
        builder.Property(x => x.NeedScore).IsRequired(false);
        builder.Property(x => x.TimelineScore).IsRequired(false);
        builder.Property(x => x.PipelineStage).HasConversion<string>().IsRequired(false);
        builder.Property(x => x.ClosingStatus).IsRequired(false);
        builder.Property(x => x.ClosingNote).HasMaxLength(DescriptionConsts.MaxLength).IsRequired(false);
        builder.Property(x => x.CampaignId).HasMaxLength(IdConsts.MaxLength).IsRequired(false);
        builder.Property(x => x.SalesTeamId).HasMaxLength(IdConsts.MaxLength).IsRequired(false);

        builder.HasIndex(e => e.Number);
        builder.HasIndex(e => e.Title);
        builder.HasIndex(e => e.CompanyName);
    }
}
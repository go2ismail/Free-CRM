using Application.Common.CQS.Queries;
using Application.Common.Extensions;
using Domain.Enums;
using Domain.Entities;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace JavaDashboardManager.Queries;

public class CampaignDistributionBySalesTeamDto
{
    public SalesTeam? SalesTeamDetails { get; init; } // Détails de l'équipe de vente
    public Dictionary<CampaignStatus, int>? CampaignCountByStatus { get; init; } // Nombre de campagnes par statut
}

public class GetCampaignDistributionBySalesTeamResult
{
    public List<CampaignDistributionBySalesTeamDto>? Data { get; init; }
}

public class GetCampaignDistributionBySalesTeamRequest : IRequest<GetCampaignDistributionBySalesTeamResult>
{
    public DateTime? DateDebut { get; init; } // Peut être null
    public DateTime? DateFin { get; init; }  // Peut être null
}

public class GetCampaignDistributionBySalesTeamHandler : IRequestHandler<GetCampaignDistributionBySalesTeamRequest, GetCampaignDistributionBySalesTeamResult>
{
    private readonly IQueryContext _context;

    public GetCampaignDistributionBySalesTeamHandler(IQueryContext context)
    {
        _context = context;
    }

    public async Task<GetCampaignDistributionBySalesTeamResult> Handle(GetCampaignDistributionBySalesTeamRequest request, CancellationToken cancellationToken)
    {
        // Filtrer les campagnes avec les dates
        var campaignQuery = _context.Campaign
            .Include(x => x.SalesTeam) // Inclure les détails des équipes de vente
            .AsNoTracking()
            .IsDeletedEqualTo(false);

        if (request.DateDebut.HasValue)
        {
            campaignQuery = campaignQuery.Where(x => x.CampaignDateStart >= request.DateDebut.Value);
        }

        if (request.DateFin.HasValue)
        {
            campaignQuery = campaignQuery.Where(x => x.CampaignDateFinish <= request.DateFin.Value);
        }

        var campaigns = await campaignQuery.ToListAsync(cancellationToken);

        // Regrouper les campagnes par équipe de vente
        var salesTeamCampaigns = campaigns
            .GroupBy(x => x.SalesTeam)
            .Select(group => new CampaignDistributionBySalesTeamDto
            {
                SalesTeamDetails = group.Key, // Détails de l'équipe de vente
                CampaignCountByStatus = Enum.GetValues(typeof(CampaignStatus)) // Inclure tous les statuts possibles
                    .Cast<CampaignStatus>()
                    .ToDictionary(
                        status => status,
                        status => group.Count(campaign => campaign.Status == status) // Compter les campagnes par statut
                    )
            })
            .ToList();

        return new GetCampaignDistributionBySalesTeamResult
        {
            Data = salesTeamCampaigns
        };
    }
}

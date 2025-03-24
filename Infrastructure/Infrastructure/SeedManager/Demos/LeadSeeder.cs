using Application.Common.Repositories;
using Application.Features.NumberSequenceManager;
using Domain.Entities;
using Domain.Enums;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.SeedManager.Demos;

public class LeadSeeder
{
    private readonly ICommandRepository<Lead> _leadRepository;
    private readonly ICommandRepository<Campaign> _campaignRepository;
    private readonly ICommandRepository<SalesTeam> _salesTeamRepository;
    private readonly NumberSequenceService _numberSequenceService;
    private readonly IUnitOfWork _unitOfWork;
    private readonly Random _random = new();

    public LeadSeeder(
        ICommandRepository<Lead> leadRepository,
        ICommandRepository<Campaign> campaignRepository,
        ICommandRepository<SalesTeam> salesTeamRepository,
        NumberSequenceService numberSequenceService,
        IUnitOfWork unitOfWork
    )
    {
        _leadRepository = leadRepository;
        _campaignRepository = campaignRepository;
        _salesTeamRepository = salesTeamRepository;
        _numberSequenceService = numberSequenceService;
        _unitOfWork = unitOfWork;
    }

    public async Task GenerateDataAsync()
    {
        var dateFinish = DateTime.Now;
        var dateStart = new DateTime(dateFinish.AddMonths(-11).Year, dateFinish.AddMonths(-11).Month, 1);

        var confirmedCampaigns = await _campaignRepository.GetQuery()
            .Where(c => c.Status == CampaignStatus.Confirmed)
            .Select(c => c.Id)
            .ToListAsync();

        var salesTeamIds = await _salesTeamRepository.GetQuery()
            .Select(st => st.Id)
            .ToListAsync();

        if (!confirmedCampaigns.Any() || !salesTeamIds.Any())
            return;

        var pipelineStageCounts = new Dictionary<PipelineStage, int>
        {
            { PipelineStage.Prospecting, 80 },
            { PipelineStage.Qualification, 70 },
            { PipelineStage.NeedAnalysis, 60 },
            { PipelineStage.Proposal, 50 },
            { PipelineStage.Negotiation, 40 },
            { PipelineStage.DecisionMaking, 30 },
            { PipelineStage.Closed, 15 }
        };

        var leads = new List<Lead>();

        foreach (var (stage, count) in pipelineStageCounts)
        {
            for (int i = 0; i < count; i++)
            {
                var prospectingDate = GetRandomDate(dateStart, dateFinish);
                var closingEstimation = prospectingDate.AddDays(_random.Next(30, 90));
                var closingActual = closingEstimation.AddDays(_random.Next(-10, 11));

                var companyName = GenerateCompanyName();
                var lead = new Lead
                {
                    Number = _numberSequenceService.GenerateNumber(nameof(Lead), "", "LEA"),
                    Title = $"Lead from {prospectingDate:MMMM yyyy}",
                    Description = $"Lead description for {prospectingDate:MMMM yyyy}",
                    CompanyName = companyName,
                    CompanyDescription = "Sample company description",
                    CompanyAddressStreet = $"{_random.Next(10, 9999)} Main St",
                    CompanyAddressCity = "Anytown",
                    CompanyAddressState = "State",
                    CompanyAddressZipCode = $"{_random.Next(10000, 99999)}",
                    CompanyAddressCountry = "USA",
                    CompanyPhoneNumber = GeneratePhoneNumber(),
                    CompanyFaxNumber = GeneratePhoneNumber(),
                    CompanyEmail = GenerateEmail(companyName),
                    CompanyWebsite = GenerateWebsite(companyName),
                    CompanyWhatsApp = GeneratePhoneNumber(),
                    CompanyLinkedIn = $"https://linkedin.com/company/{companyName.Replace(" ", "").ToLower()}",
                    CompanyFacebook = $"https://facebook.com/{companyName.Replace(" ", "").ToLower()}",
                    CompanyInstagram = $"https://instagram.com/{companyName.Replace(" ", "").ToLower()}",
                    CompanyTwitter = $"https://twitter.com/{companyName.Replace(" ", "").ToLower()}",
                    DateProspecting = prospectingDate,
                    DateClosingEstimation = closingEstimation,
                    DateClosingActual = closingActual,
                    AmountTargeted = 10000 * Math.Ceiling((_random.NextDouble() * 89) + 1),
                    AmountClosed = 10000 * Math.Ceiling((_random.NextDouble() * 89) + 1),
                    BudgetScore = 10.0 * Math.Ceiling(_random.NextDouble() * 10),
                    AuthorityScore = 10.0 * Math.Ceiling(_random.NextDouble() * 10),
                    NeedScore = 10.0 * Math.Ceiling(_random.NextDouble() * 10),
                    TimelineScore = 10.0 * Math.Ceiling(_random.NextDouble() * 10),
                    PipelineStage = stage,
                    ClosingStatus = (ClosingStatus)_random.Next(0, Enum.GetNames(typeof(ClosingStatus)).Length),
                    ClosingNote = "Sample closing note",
                    CampaignId = GetRandomValue(confirmedCampaigns),
                    SalesTeamId = GetRandomValue(salesTeamIds)
                };

                leads.Add(lead);
            }
        }

        foreach (var lead in leads)
        {
            await _leadRepository.CreateAsync(lead);
        }

        await _unitOfWork.SaveAsync();
    }

    public async Task GenerateRandomDataAsync(int count)
    {
        var dateFinish = DateTime.Now;
        var dateStart = new DateTime(dateFinish.AddMonths(-11).Year, dateFinish.AddMonths(-11).Month, 1);

        var confirmedCampaigns = await _campaignRepository.GetQuery()
            .Where(c => c.Status == CampaignStatus.Confirmed)
            .Select(c => c.Id)
            .ToListAsync();
        if (confirmedCampaigns.Count == 0)
        {
            return;
        }

        var salesTeamIds = await _salesTeamRepository.GetQuery()
            .Select(st => st.Id)
            .ToListAsync();

        if (!confirmedCampaigns.Any() || !salesTeamIds.Any())
            return;

        var pipelineStages = Enum.GetValues(typeof(PipelineStage)).Cast<PipelineStage>().ToList();
        var leads = new List<Lead>();

        for (int i = 0; i < count; i++)
        {
            var prospectingDate = GetRandomDate(dateStart, dateFinish);
            var closingEstimation = prospectingDate.AddDays(_random.Next(30, 90));
            var closingActual = closingEstimation.AddDays(_random.Next(-10, 11));

            var companyName = GenerateCompanyName();
            var lead = new Lead
            {
                Number = _numberSequenceService.GenerateNumber(nameof(Lead), "", "LEA"),
                Title = $"Lead {i + 1} - {prospectingDate:MMMM yyyy}",
                Description = $"Lead generated in {prospectingDate:MMMM yyyy}",
                CompanyName = companyName,
                CompanyDescription = "Generated company description",
                CompanyAddressStreet = $"{_random.Next(10, 9999)} Main St",
                CompanyAddressCity = "Anytown",
                CompanyAddressState = "State",
                CompanyAddressZipCode = $"{_random.Next(10000, 99999)}",
                CompanyAddressCountry = "USA",
                CompanyPhoneNumber = GeneratePhoneNumber(),
                CompanyFaxNumber = GeneratePhoneNumber(),
                CompanyEmail = GenerateEmail(companyName),
                CompanyWebsite = GenerateWebsite(companyName),
                CompanyWhatsApp = GeneratePhoneNumber(),
                CompanyLinkedIn = $"https://linkedin.com/company/{companyName.Replace(" ", "").ToLower()}",
                CompanyFacebook = $"https://facebook.com/{companyName.Replace(" ", "").ToLower()}",
                CompanyInstagram = $"https://instagram.com/{companyName.Replace(" ", "").ToLower()}",
                CompanyTwitter = $"https://twitter.com/{companyName.Replace(" ", "").ToLower()}",
                DateProspecting = prospectingDate,
                DateClosingEstimation = closingEstimation,
                DateClosingActual = closingActual,
                AmountTargeted = 10000 * Math.Ceiling((_random.NextDouble() * 89) + 1),
                AmountClosed = 10000 * Math.Ceiling((_random.NextDouble() * 89) + 1),
                BudgetScore = 10.0 * Math.Ceiling(_random.NextDouble() * 10),
                AuthorityScore = 10.0 * Math.Ceiling(_random.NextDouble() * 10),
                NeedScore = 10.0 * Math.Ceiling(_random.NextDouble() * 10),
                TimelineScore = 10.0 * Math.Ceiling(_random.NextDouble() * 10),
                PipelineStage = pipelineStages[_random.Next(pipelineStages.Count)],
                ClosingStatus = (ClosingStatus)_random.Next(0, Enum.GetNames(typeof(ClosingStatus)).Length),
                ClosingNote = "Auto-generated closing note",
                CampaignId = GetRandomValue(confirmedCampaigns),
                SalesTeamId = GetRandomValue(salesTeamIds)
            };

            leads.Add(lead);
        }
    }
    

    private DateTime GetRandomDate(DateTime startDate, DateTime endDate)
    {
        var range = (endDate - startDate).Days;
        return startDate.AddDays(_random.Next(range));
    }

    private string GetRandomValue(List<string> list)
    {
        return list.Any() ? list[_random.Next(list.Count)] : null;
    }

    private string GenerateCompanyName()
    {
        string[] words1 = { "Tech", "Green", "Blue", "Red", "Smart", "Next" };
        string[] words2 = { "Solutions", "Systems", "Enterprises", "Industries", "Corporation" };
        return $"{words1[_random.Next(words1.Length)]} {words2[_random.Next(words2.Length)]}";
    }

    private string GeneratePhoneNumber()
    {
        return $"+1-{_random.Next(100, 999)}-{_random.Next(100, 999)}-{_random.Next(1000, 9999)}";
    }

    private string GenerateEmail(string companyName)
    {
        string domain = new[] { "gmail.com", "yahoo.com", "outlook.com" }[_random.Next(3)];
        return $"{companyName.Replace(" ", "").ToLower()}@{domain}";
    }

    private string GenerateWebsite(string companyName)
    {
        return $"https://www.{companyName.Replace(" ", "").ToLower()}.com";
    }
}

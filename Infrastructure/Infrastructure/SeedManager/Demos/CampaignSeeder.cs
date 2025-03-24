using Application.Common.Repositories;
using Application.Features.NumberSequenceManager;
using Domain.Entities;
using Domain.Enums;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.SeedManager.Demos;

public class CampaignSeeder
{
    private readonly ICommandRepository<Campaign> _campaignRepository;
    private readonly ICommandRepository<SalesTeam> _salesTeamRepository;
    private readonly NumberSequenceService _numberSequenceService;
    private readonly IUnitOfWork _unitOfWork;

    public CampaignSeeder(
        ICommandRepository<Campaign> campaignRepository,
        ICommandRepository<SalesTeam> salesTeamRepository,
        NumberSequenceService numberSequenceService,
        IUnitOfWork unitOfWork
    )
    {
        _campaignRepository = campaignRepository;
        _salesTeamRepository = salesTeamRepository;
        _numberSequenceService = numberSequenceService;
        _unitOfWork = unitOfWork;
    }

    public async Task GenerateDataAsync()
    {
        var random = new Random();
        var dateFinish = DateTime.Now;
        var dateStart = new DateTime(dateFinish.AddMonths(-11).Year, dateFinish.AddMonths(-11).Month, 1);

        var salesTeamIds = await _salesTeamRepository.GetQuery()
            .Select(st => st.Id)
            .ToListAsync();

        for (DateTime date = dateStart; date <= dateFinish; date = date.AddMonths(1))
        {
            DateTime[] campaignStarts = GetRandomDays(date.Year, date.Month, 3);

            foreach (var campaignStart in campaignStarts)
            {
                var duration = random.Next(1, 4);
                var campaignEnd = campaignStart.AddMonths(duration);

                var status = GetRandomStatus(random);
                string number = _numberSequenceService.GenerateNumber(nameof(Campaign), "", "CMP");
                string firstFourChars = number.Length >= 4 ? number.Substring(0, 4) : number;

                var campaign = new Campaign
                {
                    Number = number,
                    Title = $"{firstFourChars} Campaign for {campaignStart:MMMM yyyy}",
                    Description = $"Description for campaign starting {campaignStart:MMMM yyyy}",
                    TargetRevenueAmount = 10000 * Math.Ceiling((random.NextDouble() * 89) + 1),
                    CampaignDateStart = campaignStart,
                    CampaignDateFinish = campaignEnd,
                    Status = status,
                    SalesTeamId = GetRandomValue(salesTeamIds, random)
                };

                await _campaignRepository.CreateAsync(campaign);
            }
        }

        await _unitOfWork.SaveAsync();
    }

    public async Task GenerateRandomDataAsync(int numberOfCampaigns)
    {
        var random = new Random();
        var salesTeamIds = await _salesTeamRepository.GetQuery()
            .Select(st => st.Id)
            .ToListAsync();

        var campaigns = new List<Campaign>();

        for (int i = 0; i < numberOfCampaigns; i++)
        {
            var campaignStart = GetRandomDate(random);
            var duration = random.Next(1, 4);
            var campaignEnd = campaignStart.AddMonths(duration);
            var status = GetRandomStatus(random);
            string number = _numberSequenceService.GenerateNumber(nameof(Campaign), "", "CMP");

            var campaign = new Campaign
            {
                Number = number,
                Title = $"Random Campaign {i + 1}",
                Description = $"Automatically generated campaign {i + 1}",
                TargetRevenueAmount = 10000 * Math.Ceiling((random.NextDouble() * 89) + 1),
                CampaignDateStart = campaignStart,
                CampaignDateFinish = campaignEnd,
                Status = status,
                SalesTeamId = GetRandomValue(salesTeamIds, random)
            };

            campaigns.Add(campaign);
        }

        foreach (var campaign in campaigns)
        {
            await _campaignRepository.CreateAsync(campaign);
        }

        await _unitOfWork.SaveAsync();
    }

    private CampaignStatus GetRandomStatus(Random random)
    {
        var statuses = new[]
        {
            CampaignStatus.Draft, CampaignStatus.Cancelled, CampaignStatus.Confirmed, 
            CampaignStatus.OnProgress, CampaignStatus.OnHold, CampaignStatus.Finished, CampaignStatus.Archived
        };
        var weights = new[] { 1, 1, 4, 2, 1, 1, 1 };

        int totalWeight = weights.Sum();
        int randomNumber = random.Next(0, totalWeight);

        for (int i = 0; i < statuses.Length; i++)
        {
            if (randomNumber < weights[i])
            {
                return statuses[i];
            }
            randomNumber -= weights[i];
        }

        return CampaignStatus.Confirmed;
    }

    private static string GetRandomValue(List<string> list, Random random)
    {
        return list[random.Next(list.Count)];
    }

    private static DateTime GetRandomDate(Random random)
    {
        var start = DateTime.Now.AddMonths(-12);
        var range = (DateTime.Now - start).Days;
        return start.AddDays(random.Next(range));
    }

    private static DateTime[] GetRandomDays(int year, int month, int count)
    {
        var random = new Random();
        var daysInMonth = Enumerable.Range(1, DateTime.DaysInMonth(year, month)).ToList();
        var selectedDays = new HashSet<int>();

        while (selectedDays.Count < count && daysInMonth.Count > 0)
        {
            int day = daysInMonth[random.Next(daysInMonth.Count)];
            selectedDays.Add(day);
            daysInMonth.Remove(day);
        }

        return selectedDays.Select(day => new DateTime(year, month, day)).ToArray();
    }
}

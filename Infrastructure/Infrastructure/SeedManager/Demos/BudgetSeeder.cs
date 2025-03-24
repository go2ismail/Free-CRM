using Application.Common.Repositories;
using Application.Features.NumberSequenceManager;
using Domain.Entities;
using Domain.Enums;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.SeedManager.Demos;

public class BudgetSeeder
{
    private readonly ICommandRepository<Budget> _budgetRepository;
    private readonly ICommandRepository<Campaign> _campaignRepository;
    private readonly NumberSequenceService _numberSequenceService;
    private readonly IUnitOfWork _unitOfWork;

    public BudgetSeeder(
        ICommandRepository<Budget> budgetRepository,
        ICommandRepository<Campaign> campaignRepository,
        NumberSequenceService numberSequenceService,
        IUnitOfWork unitOfWork
    )
    {
        _budgetRepository = budgetRepository;
        _campaignRepository = campaignRepository;
        _numberSequenceService = numberSequenceService;
        _unitOfWork = unitOfWork;
    }

    public async Task GenerateDataAsync()
    {
        var random = new Random();
        var dateFinish = DateTime.Now;
        var dateStart = new DateTime(dateFinish.AddMonths(-11).Year, dateFinish.AddMonths(-11).Month, 1);

        var confirmedCampaigns = await _campaignRepository.GetQuery()
            .Where(c => c.Status == CampaignStatus.Confirmed)
            .Select(c => c.Id)
            .ToListAsync();

        for (DateTime date = dateStart; date < dateFinish; date = date.AddMonths(1))
        {
            DateTime[] transactionDates = GetRandomDays(date.Year, date.Month, 10);

            foreach (var campaignId in confirmedCampaigns)
            {
                int numberOfBudgets = random.Next(2, 6);

                for (int i = 0; i < numberOfBudgets; i++)
                {
                    if (transactionDates.Length == 0) break;

                    var transDate = GetRandomAndRemove(ref transactionDates, random);
                    var status = GetRandomStatus(random);

                    var budget = new Budget
                    {
                        Number = _numberSequenceService.GenerateNumber(nameof(Budget), "", "BUD"),
                        Title = $"Budget for {transDate:MMMM yyyy}",
                        Description = $"Description for budget on {transDate:MMMM yyyy}",
                        BudgetDate = transDate,
                        Status = status,
                        Amount = 10000 * Math.Ceiling((random.NextDouble() * 89) + 1),
                        CampaignId = campaignId
                    };

                    await _budgetRepository.CreateAsync(budget);
                }
            }
        }

        await _unitOfWork.SaveAsync();
    }

    public async Task GenerateRandomDataAsync(int numberOfBudgets)
    {
        var random = new Random();
        var confirmedCampaigns = await _campaignRepository.GetQuery()
            .Where(c => c.Status == CampaignStatus.Confirmed)
            .Select(c => c.Id)
            .ToListAsync();
        if (confirmedCampaigns.Count == 0)
        {
            return;
        }
        var budgets = new List<Budget>();

        for (int i = 0; i < numberOfBudgets; i++)
        {
            var budgetDate = GetRandomDate(random);
            var status = GetRandomStatus(random);
            var budget = new Budget
            {
                Number = _numberSequenceService.GenerateNumber(nameof(Budget), "", "BUD"),
                Title = $"Random Budget {i + 1}",
                Description = $"Automatically generated budget {i + 1}",
                BudgetDate = budgetDate,
                Status = status,
                Amount = 10000 * Math.Ceiling((random.NextDouble() * 89) + 1),
                CampaignId = GetRandomValue(confirmedCampaigns, random)
            };

            budgets.Add(budget);
        }

        foreach (var budget in budgets)
        {
            await _budgetRepository.CreateAsync(budget);
        }

        await _unitOfWork.SaveAsync();
    }

    private BudgetStatus GetRandomStatus(Random random)
    {
        var statuses = new[] { BudgetStatus.Draft, BudgetStatus.Cancelled, BudgetStatus.Confirmed, BudgetStatus.Archived };
        var weights = new[] { 1, 1, 3, 1 };

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

        return BudgetStatus.Confirmed;
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
        var selectedDays = new List<int>();

        for (int i = 0; i < count && daysInMonth.Count > 0; i++)
        {
            int day = daysInMonth[random.Next(daysInMonth.Count)];
            selectedDays.Add(day);
            daysInMonth.Remove(day);
        }

        return selectedDays.Select(day => new DateTime(year, month, day)).ToArray();
    }

    private static T GetRandomAndRemove<T>(ref T[] list, Random random)
    {
        if (list.Length == 0) return default;

        int index = random.Next(list.Length);
        T value = list[index];
        list = list.Where((item, idx) => idx != index).ToArray();
        return value;
    }
}

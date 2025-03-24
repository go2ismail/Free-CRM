using Application.Common.Repositories;
using Application.Features.NumberSequenceManager;
using Domain.Entities;
using Domain.Enums;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.SeedManager.Demos;

public class ExpenseSeeder
{
    private readonly ICommandRepository<Expense> _expenseRepository;
    private readonly ICommandRepository<Campaign> _campaignRepository;
    private readonly NumberSequenceService _numberSequenceService;
    private readonly IUnitOfWork _unitOfWork;

    public ExpenseSeeder(
        ICommandRepository<Expense> expenseRepository,
        ICommandRepository<Campaign> campaignRepository,
        NumberSequenceService numberSequenceService,
        IUnitOfWork unitOfWork
    )
    {
        _expenseRepository = expenseRepository;
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
        if (confirmedCampaigns.Count == 0)
        {
            return;
        }
        for (DateTime date = dateStart; date <= dateFinish; date = date.AddMonths(1))
        {
            DateTime[] expenseDates = GetRandomDays(date.Year, date.Month, 5);

            foreach (var expenseDate in expenseDates)
            {
                var status = GetRandomStatus(random);
                var expense = new Expense
                {
                    Number = _numberSequenceService.GenerateNumber(nameof(Expense), "", "EXP"),
                    Title = $"Expense for {expenseDate:MMMM yyyy}",
                    Description = $"Description for expense on {expenseDate:MMMM yyyy}",
                    ExpenseDate = expenseDate,
                    Status = status,
                    Amount = 1000 * Math.Ceiling((random.NextDouble() * 89) + 1),
                    CampaignId = GetRandomValue(confirmedCampaigns, random)
                };

                await _expenseRepository.CreateAsync(expense);
            }
        }

        await _unitOfWork.SaveAsync();
    }

    public async Task GenerateRandomDataAsync(int numberOfExpenses)
    {
        var random = new Random();
        var confirmedCampaigns = await _campaignRepository.GetQuery()
            .Where(c => c.Status == CampaignStatus.Confirmed)
            .Select(c => c.Id)
            .ToListAsync();

        var expenses = new List<Expense>();

        for (int i = 0; i < numberOfExpenses; i++)
        {
            var expenseDate = GetRandomDate(random);
            var status = GetRandomStatus(random);
            var expense = new Expense
            {
                Number = _numberSequenceService.GenerateNumber(nameof(Expense), "", "EXP"),
                Title = $"Random Expense {i + 1}",
                Description = $"Automatically generated expense {i + 1}",
                ExpenseDate = expenseDate,
                Status = status,
                Amount = 1000 * Math.Ceiling((random.NextDouble() * 89) + 1),
                CampaignId = GetRandomValue(confirmedCampaigns, random)
            };

            expenses.Add(expense);
        }

        foreach (var expense in expenses)
        {
            await _expenseRepository.CreateAsync(expense);
        }

        await _unitOfWork.SaveAsync();
    }

    private ExpenseStatus GetRandomStatus(Random random)
    {
        var statuses = new[] { ExpenseStatus.Draft, ExpenseStatus.Cancelled, ExpenseStatus.Confirmed, ExpenseStatus.Archived };
        var weights = new[] { 1, 1, 4, 1 };

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

        return ExpenseStatus.Confirmed;
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

        for (int i = 0; i < count; i++)
        {
            int day = daysInMonth[random.Next(daysInMonth.Count)];
            selectedDays.Add(day);
            daysInMonth.Remove(day);
        }

        return selectedDays.Select(day => new DateTime(year, month, day)).ToArray();
    }
}

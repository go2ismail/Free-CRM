using Application.Common.Repositories;
using Application.Features.NumberSequenceManager;
using Domain.Entities;
using Domain.Enums;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.SeedManager.Demos;

public class LeadActivitySeeder
{
    private readonly ICommandRepository<LeadActivity> _leadActivityRepository;
    private readonly ICommandRepository<Lead> _leadRepository;
    private readonly NumberSequenceService _numberSequenceService;
    private readonly IUnitOfWork _unitOfWork;

    public LeadActivitySeeder(
        ICommandRepository<LeadActivity> leadActivityRepository,
        ICommandRepository<Lead> leadRepository,
        NumberSequenceService numberSequenceService,
        IUnitOfWork unitOfWork
    )
    {
        _leadActivityRepository = leadActivityRepository;
        _leadRepository = leadRepository;
        _numberSequenceService = numberSequenceService;
        _unitOfWork = unitOfWork;
    }

    public async Task GenerateDataAsync()
    {
        var random = new Random();
        var dateFinish = DateTime.Now;
        var dateStart = new DateTime(dateFinish.AddMonths(-11).Year, dateFinish.AddMonths(-11).Month, 1);

        var leads = await _leadRepository.GetQuery().Select(l => l.Id).ToListAsync();
        if (!leads.Any()) return;

        for (DateTime date = dateStart; date <= dateFinish; date = date.AddMonths(1))
        {
            DateTime[] activityDates = GetRandomDays(date.Year, date.Month, 10);

            foreach (var activityDate in activityDates)
            {
                var leadId = GetRandomValue(leads, random);
                var fromDate = activityDate;
                var toDate = fromDate.AddHours(random.Next(1, 5));

                var leadActivity = new LeadActivity
                {
                    LeadId = leadId,
                    Number = _numberSequenceService.GenerateNumber(nameof(LeadActivity), "", "LA"),
                    Summary = $"Activity on {fromDate:MMMM d, yyyy}",
                    Description = $"Description for activity on {fromDate:MMMM d, yyyy}",
                    FromDate = fromDate,
                    ToDate = toDate,
                    Type = GetRandomEnumValue<LeadActivityType>(random),
                    AttachmentName = GetRandomAttachment(random)
                };

                await _leadActivityRepository.CreateAsync(leadActivity);
            }
        }

        await _unitOfWork.SaveAsync();
    }

    public async Task GenerateRandomDataAsync(int numberOfActivities)
    {
        var random = new Random();
        var leads = await _leadRepository.GetQuery().Select(l => l.Id).ToListAsync();
        if (!leads.Any()) return;

        var activities = new List<LeadActivity>();

        for (int i = 0; i < numberOfActivities; i++)
        {
            var fromDate = GetRandomDate(random);
            var toDate = fromDate.AddHours(random.Next(1, 5));

            var leadActivity = new LeadActivity
            {
                LeadId = GetRandomValue(leads, random),
                Number = _numberSequenceService.GenerateNumber(nameof(LeadActivity), "", "LA"),
                Summary = $"Random Activity {i + 1}",
                Description = $"Automatically generated activity {i + 1}",
                FromDate = fromDate,
                ToDate = toDate,
                Type = GetRandomEnumValue<LeadActivityType>(random),
                AttachmentName = GetRandomAttachment(random)
            };

            activities.Add(leadActivity);
        }

        foreach (var activity in activities)
        {
            await _leadActivityRepository.CreateAsync(activity);
        }

        await _unitOfWork.SaveAsync();
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

    private static T GetRandomEnumValue<T>(Random random) where T : Enum
    {
        var values = Enum.GetValues(typeof(T));
        return (T)values.GetValue(random.Next(values.Length));
    }

    private static string GetRandomAttachment(Random random)
    {
        return random.Next(1, 100) % 3 == 0 ? $"attachment_{random.Next(1, 100)}.pdf" : null;
    }
}

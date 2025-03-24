using Application.Common.Repositories;
using Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.SeedManager.Demos;

public class RateSeeder
{
    private readonly ICommandRepository<Rate> _rateRepository;
    private readonly IUnitOfWork _unitOfWork;

    public RateSeeder(
        ICommandRepository<Rate> configRepository,
        IUnitOfWork unitOfWork)
    {
        _rateRepository = configRepository;
        _unitOfWork = unitOfWork;
    }

    public async Task GenerateDataAsync()
    {
        var random = new Random();
        var existingConfigs = await _rateRepository.GetQuery()
            .Where(c => c.ValidateDate != null && c.ExpiringeDate != null)
            .ToListAsync();

        var existingRanges = existingConfigs
            .Select(c => new DateRange(c.ValidateDate!.Value, c.ExpiringeDate!.Value))
            .ToList();

        var newRanges = new List<DateRange>();
        var dateEnd = DateTime.Now;
        var dateStart = dateEnd.AddYears(-1);

        for (DateTime currentMonth = dateStart; currentMonth <= dateEnd; currentMonth = currentMonth.AddMonths(1))
        {
            var monthStart = new DateTime(currentMonth.Year, currentMonth.Month, 1);
            var monthEnd = monthStart.AddMonths(1).AddDays(-1);

            if (!HasOverlap(existingRanges, monthStart, monthEnd) && 
                !HasOverlap(newRanges, monthStart, monthEnd))
            {
                var config = new Rate
                {
                    Ratio = Math.Round(random.NextDouble() * 100, 2),
                    ValidateDate = monthStart,
                    ExpiringeDate = monthEnd
                };

                await _rateRepository.CreateAsync(config);
                newRanges.Add(new DateRange(monthStart, monthEnd));
            }
        }

        await _unitOfWork.SaveAsync();
    }

    private bool HasOverlap(List<DateRange> ranges, DateTime start, DateTime end)
    {
        return ranges.Any(r => 
            (start >= r.Start && start <= r.End) ||
            (end >= r.Start && end <= r.End) ||
            (r.Start >= start && r.Start <= end));
    }

    private record DateRange(DateTime Start, DateTime End);
}
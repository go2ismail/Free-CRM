using Application.Common.Repositories;
using Application.Features.NumberSequenceManager;
using Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.SeedManager.Demos;

public class LeadContactSeeder
{
    private readonly ICommandRepository<LeadContact> _leadContactRepository;
    private readonly ICommandRepository<Lead> _leadRepository;
    private readonly NumberSequenceService _numberSequenceService;
    private readonly IUnitOfWork _unitOfWork;

    public LeadContactSeeder(
        ICommandRepository<LeadContact> leadContactRepository,
        ICommandRepository<Lead> leadRepository,
        NumberSequenceService numberSequenceService,
        IUnitOfWork unitOfWork
    )
    {
        _leadContactRepository = leadContactRepository;
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
            DateTime[] contactDates = GetRandomDays(date.Year, date.Month, 5);

            foreach (var contactDate in contactDates)
            {
                var leadId = GetRandomValue(leads, random);
                var fullName = GenerateFullName(random);
                
                var leadContact = new LeadContact
                {
                    LeadId = leadId,
                    Number = _numberSequenceService.GenerateNumber(nameof(LeadContact), "", "LC"),
                    FullName = fullName,
                    Description = $"Contact generated for lead {leadId}",
                    AddressStreet = $"{random.Next(10, 9999)} {GenerateStreetName(random)}",
                    AddressCity = "Anytown",
                    AddressState = "State",
                    AddressZipCode = $"{random.Next(10000, 99999)}",
                    AddressCountry = "USA",
                    PhoneNumber = GeneratePhoneNumber(random),
                    FaxNumber = GeneratePhoneNumber(random),
                    MobileNumber = GeneratePhoneNumber(random),
                    Email = GenerateEmail(fullName),
                    Website = $"https://www.{fullName.Replace(" ", "").ToLower()}.com",
                    WhatsApp = GeneratePhoneNumber(random),
                    LinkedIn = $"https://linkedin.com/in/{fullName.Replace(" ", "").ToLower()}",
                    Facebook = $"https://facebook.com/{fullName.Replace(" ", "").ToLower()}",
                    Twitter = $"https://twitter.com/{fullName.Replace(" ", "").ToLower()}",
                    Instagram = $"https://instagram.com/{fullName.Replace(" ", "").ToLower()}",
                    AvatarName = $"avatar_{random.Next(1, 100)}.jpg"
                };

                await _leadContactRepository.CreateAsync(leadContact);
            }
        }

        await _unitOfWork.SaveAsync();
    }

    public async Task GenerateRandomDataAsync(int numberOfContacts)
    {
        var random = new Random();
        var leads = await _leadRepository.GetQuery().Select(l => l.Id).ToListAsync();
        
        if (!leads.Any()) return;

        var contacts = new List<LeadContact>();

        for (int i = 0; i < numberOfContacts; i++)
        {
            var fullName = GenerateFullName(random);
            var leadContact = new LeadContact
            {
                LeadId = GetRandomValue(leads, random),
                Number = _numberSequenceService.GenerateNumber(nameof(LeadContact), "", "LC"),
                FullName = fullName,
                Description = "Automatically generated contact",
                AddressStreet = $"{random.Next(10, 9999)} {GenerateStreetName(random)}",
                AddressCity = "Anytown",
                AddressState = "State",
                AddressZipCode = $"{random.Next(10000, 99999)}",
                AddressCountry = "USA",
                PhoneNumber = GeneratePhoneNumber(random),
                FaxNumber = GeneratePhoneNumber(random),
                MobileNumber = GeneratePhoneNumber(random),
                Email = GenerateEmail(fullName),
                Website = $"https://www.{fullName.Replace(" ", "").ToLower()}.com",
                WhatsApp = GeneratePhoneNumber(random),
                LinkedIn = $"https://linkedin.com/in/{fullName.Replace(" ", "").ToLower()}",
                Facebook = $"https://facebook.com/{fullName.Replace(" ", "").ToLower()}",
                Twitter = $"https://twitter.com/{fullName.Replace(" ", "").ToLower()}",
                Instagram = $"https://instagram.com/{fullName.Replace(" ", "").ToLower()}",
                AvatarName = $"avatar_{random.Next(1, 100)}.jpg"
            };

            contacts.Add(leadContact);
        }

        foreach (var contact in contacts)
        {
            await _leadContactRepository.CreateAsync(contact);
        }

        await _unitOfWork.SaveAsync();
    }

    private static string GetRandomValue(List<string> list, Random random)
    {
        return list[random.Next(list.Count)];
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

    private static string GenerateFullName(Random random)
    {
        string[] firstNames = { "John", "Jane", "Alex", "Chris", "Taylor", "Jordan", "Sam", "Casey" };
        string[] lastNames = { "Smith", "Johnson", "Brown", "Williams", "Jones", "Davis", "Miller" };

        return $"{firstNames[random.Next(firstNames.Length)]} {lastNames[random.Next(lastNames.Length)]}";
    }

    private static string GenerateStreetName(Random random)
    {
        string[] streets = { "Main St", "Broadway", "Elm St", "Pine Ave", "Cedar Rd", "Maple Ln" };
        return streets[random.Next(streets.Length)];
    }

    private static string GeneratePhoneNumber(Random random)
    {
        return $"+1-{random.Next(100, 999)}-{random.Next(100, 999)}-{random.Next(1000, 9999)}";
    }

    private static string GenerateEmail(string fullName)
    {
        string domain = new[] { "gmail.com", "yahoo.com", "outlook.com" }[new Random().Next(3)];
        return $"{fullName.Replace(" ", "").ToLower()}@{domain}";
    }
}

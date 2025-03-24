using Application.Common.Repositories;
using Application.Features.NumberSequenceManager;
using Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.SeedManager.Demos;

public class SalesRepresentativeSeeder
{
    private readonly ICommandRepository<SalesRepresentative> _salesRepRepository;
    private readonly ICommandRepository<SalesTeam> _salesTeamRepository;
    private readonly NumberSequenceService _numberSequenceService;
    private readonly IUnitOfWork _unitOfWork;

    public SalesRepresentativeSeeder(
        ICommandRepository<SalesRepresentative> salesRepRepository,
        ICommandRepository<SalesTeam> salesTeamRepository,
        NumberSequenceService numberSequenceService,
        IUnitOfWork unitOfWork
    )
    {
        _salesRepRepository = salesRepRepository;
        _salesTeamRepository = salesTeamRepository;
        _numberSequenceService = numberSequenceService;
        _unitOfWork = unitOfWork;
    }

    public async Task GenerateDataAsync()
    {
        var random = new Random();
        var salesTeams = await _salesTeamRepository.GetQuery().ToListAsync();

        foreach (var team in salesTeams)
        {
            for (int i = 1; i <= 5; i++)
            {
                var salesRep = new SalesRepresentative
                {
                    Name = $"Rep {i} - {team.Name}",
                    Number = _numberSequenceService.GenerateNumber(nameof(SalesRepresentative), "", "SR"),
                    JobTitle = $"Sales " + (i == 1 ? "Manager" : "Representative"),
                    EmployeeNumber = $"EMP-{random.Next(1000, 9999)}",
                    PhoneNumber = $"+1{random.Next(100, 999)}-{random.Next(100, 999)}-{random.Next(1000, 9999)}",
                    EmailAddress = $"salesrep{i}@company.com",
                    Description = $"Sales Rep for {team.Name}",
                    SalesTeamId = team.Id
                };

                await _salesRepRepository.CreateAsync(salesRep);
            }
        }

        await _unitOfWork.SaveAsync();
    }
    
    public async Task GenerateRandomDataAsync(int number)
    {
        var random = new Random();
        var salesTeams = await _salesTeamRepository.GetQuery().ToListAsync();

        for (int i = 0; i < number; i++)
        {
            var team = salesTeams[random.Next(salesTeams.Count)];

            var salesRep = new SalesRepresentative
            {
                Name = $"Rep {i + 1} - {team.Name}",
                Number = _numberSequenceService.GenerateNumber(nameof(SalesRepresentative), "", "SR"),
                JobTitle = $"Sales Representative " + i ,
                EmployeeNumber = $"EMP-{random.Next(1000, 9999)}",
                PhoneNumber = $"+1{random.Next(100, 999)}-{random.Next(100, 999)}-{random.Next(1000, 9999)}",
                EmailAddress = $"salesrep{i + 1}@company.com",
                Description = $"Sales Rep for {team.Name}",
                SalesTeamId = team.Id
            };

            await _salesRepRepository.CreateAsync(salesRep);
        }

        await _unitOfWork.SaveAsync();
    }

}
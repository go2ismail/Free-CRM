using Application.Common.Repositories;
using Domain.Entities;

namespace Infrastructure.SeedManager.Demos;

public class SalesTeamSeeder
{
    private readonly ICommandRepository<SalesTeam> _repository;
    private readonly IUnitOfWork _unitOfWork;

    public SalesTeamSeeder(
        ICommandRepository<SalesTeam> repository,
        IUnitOfWork unitOfWork
    )
    {
        _repository = repository;
        _unitOfWork = unitOfWork;
    }

    public async Task GenerateDataAsync()
    {
        var salesTeams = new List<SalesTeam>
        {
            new SalesTeam { Name = "The Trailblazers" },
            new SalesTeam { Name = "Revenue Rockets" },
            new SalesTeam { Name = "Deal Makers" },
            new SalesTeam { Name = "Sales Ninjas" },
            new SalesTeam { Name = "Profit Pioneers" },
            new SalesTeam { Name = "Closing Crew" },
            new SalesTeam { Name = "Growth Gurus" },
            new SalesTeam { Name = "The Persuaders" },
            new SalesTeam { Name = "Market Mavens" },
            new SalesTeam { Name = "Sales Savants" }
        };

        foreach (var salesTeam in salesTeams)
        {
            await _repository.CreateAsync(salesTeam);
        }

        await _unitOfWork.SaveAsync();
    }
    
    public async Task GenerateRandomDataAsync(int number)
    {
        var salesTeams = new List<SalesTeam>();

        for (int i = 0; i < number; i++)
        {
            var salesTeam = new SalesTeam
            {
                Name = $"Sales Team {i + 1}"
            };

            salesTeams.Add(salesTeam);
        }

        foreach (var salesTeam in salesTeams)
        {
            await _repository.CreateAsync(salesTeam);
        }

        await _unitOfWork.SaveAsync();
    }

}
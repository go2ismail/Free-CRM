using Application.Common.Repositories;
using Domain.Entities;

namespace Infrastructure.SeedManager.Demos;

public class TaxSeeder
{
    private readonly ICommandRepository<Tax> _repository;
    private readonly IUnitOfWork _unitOfWork;

    public TaxSeeder(
        ICommandRepository<Tax> repository,
        IUnitOfWork unitOfWork
    )
    {
        _repository = repository;
        _unitOfWork = unitOfWork;
    }

    public async Task GenerateDataAsync()
    {
        var taxes = new List<Tax>
        {
            new Tax { Name = "NOTAX", Percentage = 0.0 },
            new Tax { Name = "T10", Percentage = 10.0 },
            new Tax { Name = "T15", Percentage = 15.0 },
            new Tax { Name = "T20", Percentage = 20.0 }
        };

        foreach (var tax in taxes)
        {
            await _repository.CreateAsync(tax);
        }

        await _unitOfWork.SaveAsync();
    }
    
    public async Task GenerateRandomDataAsync(int number)
    {
        var random = new Random();
        var taxes = new List<Tax>();

        for (int i = 0; i < number; i++)
        {
            var tax = new Tax
            {
                Name = $"T{random.Next(5, 30)}", // Génère un nom de type "T10", "T15", etc.
                Percentage = random.NextDouble() * (30.0 - 5.0) + 5.0 // Génère un pourcentage entre 5% et 30%
            };

            taxes.Add(tax);
        }

        foreach (var tax in taxes)
        {
            await _repository.CreateAsync(tax);
        }

        await _unitOfWork.SaveAsync();
    }

}


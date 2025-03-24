using Application.Common.Repositories;
using Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Infrastructure.SeedManager.Demos;

public class ProductGroupSeeder
{
    private readonly ICommandRepository<ProductGroup> _productGroupRepository;
    private readonly IUnitOfWork _unitOfWork;
    private static readonly Random _random = new();

    public ProductGroupSeeder(
        ICommandRepository<ProductGroup> productGroupRepository,
        IUnitOfWork unitOfWork
    )
    {
        _productGroupRepository = productGroupRepository;
        _unitOfWork = unitOfWork;
    }

    public async Task GenerateDataAsync()
    {
        var productGroups = new List<ProductGroup>
        {
            new ProductGroup { Name = "Hardware" },
            new ProductGroup { Name = "Networking" },
            new ProductGroup { Name = "Storage" },
            new ProductGroup { Name = "Device" },
            new ProductGroup { Name = "Software" },
            new ProductGroup { Name = "Service" }
        };

        foreach (var productGroup in productGroups)
        {
            await _productGroupRepository.CreateAsync(productGroup);
        }

        await _unitOfWork.SaveAsync();
    }

    public List<ProductGroup> GetRandomData(int number)
    {
        return Enumerable.Range(1, number)
            .Select(i => new ProductGroup { Name = $"Product Group {i}" })
            .ToList();
    }

    public async Task GenerateRandomDataAsync(int number)
    {
        for (int i = 1; i <= number; i++)
        {
            var productGroup = new ProductGroup { Name = $"Product Group {i}" };
            await _productGroupRepository.CreateAsync(productGroup);
        }
        
        await _unitOfWork.SaveAsync();
    }
}
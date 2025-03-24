using Application.Common.Repositories;
using Domain.Entities;

namespace Infrastructure.SeedManager.Demos;

public class VendorCategorySeeder
{
    private readonly ICommandRepository<VendorCategory> _categoryRepository;
    private readonly IUnitOfWork _unitOfWork;

    public VendorCategorySeeder(
        ICommandRepository<VendorCategory> categoryRepository,
        IUnitOfWork unitOfWork
    )
    {
        _categoryRepository = categoryRepository;
        _unitOfWork = unitOfWork;
    }

    public async Task GenerateDataAsync()
    {
        var vendorCategories = new List<VendorCategory>
        {
            new VendorCategory { Name = "Large" },
            new VendorCategory { Name = "Medium" },
            new VendorCategory { Name = "Small" },
            new VendorCategory { Name = "Specialty" },
            new VendorCategory { Name = "Local" },
            new VendorCategory { Name = "Global" }
        };

        foreach (var category in vendorCategories)
        {
            await _categoryRepository.CreateAsync(category);
        }

        await _unitOfWork.SaveAsync();
    }
    
    public async Task GenerateRandomDataAsync(int number)
    {
        var vendorCategories = new List<VendorCategory>();

        for (int i = 1; i <= number; i++)
        {
            vendorCategories.Add(new VendorCategory
            {
                Name = $"VendorCategory {i}"
            });
        }

        foreach (var category in vendorCategories)
        {
            await _categoryRepository.CreateAsync(category);
        }

        await _unitOfWork.SaveAsync();
    }

}

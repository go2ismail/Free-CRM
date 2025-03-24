using Application.Common.Repositories;
using Domain.Entities;

namespace Infrastructure.SeedManager.Demos;

public class CustomerCategorySeeder
{
    private readonly ICommandRepository<CustomerCategory> _categoryRepository;
    private readonly IUnitOfWork _unitOfWork;

    public CustomerCategorySeeder(
        ICommandRepository<CustomerCategory> categoryRepository,
        IUnitOfWork unitOfWork
    )
    {
        _categoryRepository = categoryRepository;
        _unitOfWork = unitOfWork;
    }

    public async Task GenerateDataAsync()
    {
        var customerCategories = new List<CustomerCategory>
        {
            new CustomerCategory { Name = "Enterprise" },
            new CustomerCategory { Name = "Medium" },
            new CustomerCategory { Name = "Small" },
            new CustomerCategory { Name = "Startup" },
            new CustomerCategory { Name = "Micro" }
        };
        
        foreach (var category in customerCategories)
        {
            await _categoryRepository.CreateAsync(category);
        }

        await _unitOfWork.SaveAsync();
    }
    
    public async Task GenerateRandomDataAsync(int numberOfBudgets)
    {
        var random = new Random();
        
        for (int i = 0; i < numberOfBudgets; i++)
        {
            var customerCategory = new CustomerCategory { Name = "Customer Category n-" + i };
            await _categoryRepository.CreateAsync(customerCategory);
        };
        
       
        await _unitOfWork.SaveAsync();
    }
}



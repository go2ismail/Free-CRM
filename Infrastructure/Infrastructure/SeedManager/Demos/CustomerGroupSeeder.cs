using Application.Common.Repositories;
using Domain.Entities;

namespace Infrastructure.SeedManager.Demos;

public class CustomerGroupSeeder
{
    private readonly ICommandRepository<CustomerGroup> _groupRepository;
    private readonly IUnitOfWork _unitOfWork;

    public CustomerGroupSeeder(
        ICommandRepository<CustomerGroup> groupRepository,
        IUnitOfWork unitOfWork
    )
    {
        _groupRepository = groupRepository;
        _unitOfWork = unitOfWork;
    }

    public async Task GenerateDataAsync()
    {
        var customerGroups = new List<CustomerGroup>
        {
            new CustomerGroup { Name = "Corporate" },
            new CustomerGroup { Name = "Government" },
            new CustomerGroup { Name = "Foundation" },
            new CustomerGroup { Name = "Military" },
            new CustomerGroup { Name = "Education" },
            new CustomerGroup { Name = "Hospitality" }
        };

        foreach (var group in customerGroups)
        {
            await _groupRepository.CreateAsync(group);
        }

        await _unitOfWork.SaveAsync();
    }
    
    public async Task GenerateRandomDataAsync(int numberOfBudgets)
    {
        var random = new Random();
        
        for (int i = 0; i < numberOfBudgets; i++)
        {
            var customerGroup = new CustomerGroup() { Name = "Customer Group n-" + i };
            await _groupRepository.CreateAsync(customerGroup);
        };
        
       
        await _unitOfWork.SaveAsync();
    }
}



using Application.Common.Repositories;
using Domain.Entities;

namespace Infrastructure.SeedManager.Demos;

public class VendorGroupSeeder
{
    private readonly ICommandRepository<VendorGroup> _groupRepository;
    private readonly IUnitOfWork _unitOfWork;

    public VendorGroupSeeder(
        ICommandRepository<VendorGroup> groupRepository,
        IUnitOfWork unitOfWork
    )
    {
        _groupRepository = groupRepository;
        _unitOfWork = unitOfWork;
    }

    public async Task GenerateDataAsync()
    {
        var vendorGroups = new List<VendorGroup>
        {
            new VendorGroup { Name = "Manufacture" },
            new VendorGroup { Name = "Supplier" },
            new VendorGroup { Name = "Service Provider" },
            new VendorGroup { Name = "Distributor" },
            new VendorGroup { Name = "Freelancer" }
        };

        foreach (var group in vendorGroups)
        {
            await _groupRepository.CreateAsync(group);
        }

        await _unitOfWork.SaveAsync();
    }
    
    public async Task GenerateRandomDataAsync(int number)
    {
        var random = new Random();
        var vendorGroups = new List<VendorGroup>();

        for (int i = 1; i <= number; i++)
        {
            vendorGroups.Add(new VendorGroup
            {
                Name = $"VendorGroup {i}"
            });
        }

        foreach (var group in vendorGroups)
        {
            await _groupRepository.CreateAsync(group);
        }

        await _unitOfWork.SaveAsync();
    }

}

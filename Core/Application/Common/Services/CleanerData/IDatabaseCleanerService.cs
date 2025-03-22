
namespace Application.Common.Services.CleanerData;

public interface IDatabaseCleanerService
{
    Task<CleanupReport> CleanAllDataAsync();
}
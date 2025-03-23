namespace Application.Common.Services.SeedManager
{
    public interface IDataSeederService
    {
        Task SeedSystemDataAsync();
        Task SeedDemoDataAsync();
    }
}

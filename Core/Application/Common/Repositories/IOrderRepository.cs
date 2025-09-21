using System.Data;
using System.Data.Common;

namespace Application.Common.Repositories
{
    public interface IOrderRepository<T>
    {
        Task<List<string>> GetTableNamesAsync(CancellationToken cancellationToken = default);
        Task ClearTableAsync(string tableName, CancellationToken cancellationToken = default);
        
        Task<DataTable> ExecuteQueryAsync(string query, CancellationToken cancellationToken = default);
        DbConnection GetDbConnection();
    }
}
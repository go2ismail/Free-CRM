using Application.Common.Repositories;
using Domain.Common;
using Infrastructure.DataAccessManager.EFCore.Contexts;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Data;
using System.Data.Common;
using System.Threading;
using System.Threading.Tasks;

namespace Infrastructure.DataAccessManager.EFCore.Repositories
{
    public class OrderRepository<T> : IOrderRepository<T>
    {
        protected readonly OrderContext _context;

        public OrderRepository(OrderContext context)
        {
            _context = context;
        }

        public async Task<List<string>> GetTableNamesAsync(CancellationToken cancellationToken = default)
        {
            var tableNames = new List<string>();
            var sql = "SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_TYPE = 'BASE TABLE'";
            
            var connection = _context.Database.GetDbConnection();
            if (connection.State == ConnectionState.Closed)
            {
                await connection.OpenAsync(cancellationToken);
            }

            using (var command = connection.CreateCommand())
            {
                command.CommandText = sql;
                using (var reader = await command.ExecuteReaderAsync(cancellationToken))
                {
                    while (await reader.ReadAsync(cancellationToken))
                    {
                        tableNames.Add(reader.GetString(0));
                    }
                }
            }

            return tableNames;
        }

        public async Task ClearTableAsync(string tableName, CancellationToken cancellationToken = default)
        {
            if (string.IsNullOrWhiteSpace(tableName))
                throw new ArgumentException("Invalid table name", nameof(tableName));

            var connection = _context.Database.GetDbConnection();
            if (connection.State == ConnectionState.Closed)
            {
                await connection.OpenAsync(cancellationToken);
            }

            using var transaction = await _context.Database.BeginTransactionAsync(cancellationToken);
            try
            {

                var disableForeignKeysSql = $@"
            DECLARE @sql NVARCHAR(MAX) = '';
            SELECT @sql += 'ALTER TABLE [' + OBJECT_NAME(parent_object_id) + '] DROP CONSTRAINT [' + name + '];'
            FROM sys.foreign_keys
            WHERE referenced_object_id = OBJECT_ID('{tableName}');
            EXEC sp_executesql @sql;";
                await _context.Database.ExecuteSqlRawAsync(disableForeignKeysSql, cancellationToken);

                await _context.Database.ExecuteSqlRawAsync($"DELETE FROM [{tableName}]", cancellationToken);
                
                var deleteForeignKeysSql = $@"
            DECLARE @sql NVARCHAR(MAX) = '';
            SELECT @sql += 'ALTER TABLE [' + OBJECT_NAME(parent_object_id) + '] DROP CONSTRAINT [' + name + '];'
            FROM sys.foreign_keys
            WHERE referenced_object_id = OBJECT_ID('{tableName}');
            EXEC sp_executesql @sql;";
                await _context.Database.ExecuteSqlRawAsync(deleteForeignKeysSql, cancellationToken);
                
                await transaction.CommitAsync(cancellationToken);
            }
            catch
            {
                await transaction.RollbackAsync(cancellationToken);
                throw;
            }
        }
        
        public async Task<DataTable> ExecuteQueryAsync(string sqlQuery, CancellationToken cancellationToken = default)
        {
            if (string.IsNullOrWhiteSpace(sqlQuery))
                throw new ArgumentException("SQL query cannot be empty", nameof(sqlQuery));

            var connection = _context.Database.GetDbConnection();
            if (connection.State == ConnectionState.Closed)
            {
                await connection.OpenAsync(cancellationToken);
            }

            using var command = connection.CreateCommand();
            command.CommandText = sqlQuery;

            var dataTable = new DataTable();

            using (var reader = await command.ExecuteReaderAsync(cancellationToken))
            {
                dataTable.Load(reader);
            }

            return dataTable;
        }
        
        public DbConnection GetDbConnection()
        {
            return _context.Database.GetDbConnection();
        }
        
    }
}

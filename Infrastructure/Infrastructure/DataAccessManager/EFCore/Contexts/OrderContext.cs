using Application.Common.CQS.Commands;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.DataAccessManager.EFCore.Contexts;
public class OrderContext : DataContext, IOrderContext
{
    public OrderContext(DbContextOptions<DataContext> options)
        : base(options)
    {
    }
}


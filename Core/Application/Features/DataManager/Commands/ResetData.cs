using System.Reflection;
using MediatR;
using FluentValidation;
using System.Threading;
using System.Threading.Tasks;
using Application.Common.Repositories;
using Domain.Common;
using MediatR;

namespace Application.Features.DataManager.Commands
{
    public record ResetDataResult
    {
        public string Message { get; init; }
    }
    
    public class ResetDataRequest : IRequest<ResetDataResult>
    {
       
    }
    
    public class ResetDataValidator : AbstractValidator<ResetDataRequest>
    {
        public ResetDataValidator()
        {
        }
    }
    
    
    public class ResetDataHandler : IRequestHandler<ResetDataRequest, ResetDataResult>
    {
        private readonly IServiceProvider _serviceProvider;
        private readonly IUnitOfWork _unitOfWork;

        public ResetDataHandler(IServiceProvider serviceProvider, IUnitOfWork unitOfWork)
        {
            _serviceProvider = serviceProvider;
            _unitOfWork = unitOfWork;
        }

        public async Task<ResetDataResult> Handle(ResetDataRequest request, CancellationToken cancellationToken)
        {
            try
            {

                var entityTypes = Assembly.GetAssembly(typeof(BaseEntity))
                    .GetTypes()
                    .Where(t => t.IsClass && !t.IsAbstract && typeof(BaseEntity).IsAssignableFrom(t) && t != typeof(BaseEntity))
                    .ToList();
                
                
                foreach (var entityType in entityTypes)
                {
                    var entity = Activator.CreateInstance(entityType);
                   
                    if (entity == null)
                    {
                        continue;
                    }

                    var repositoryType = typeof(ICommandRepository<>).MakeGenericType(entityType);
                    var repository = _serviceProvider.GetService(repositoryType);
                    if (repository == null)
                    {
                        continue;
                    }

                    var purgeMethod = repository.GetType().GetMethod("PurgeAll");
                    if (purgeMethod != null)
                    {
                        purgeMethod.Invoke(repository, null);
                    }
                }

                _unitOfWork.SaveAsync();

                return new ResetDataResult
                {
                    Message = "'Data has been reset successfully.'."
                };
            }
            catch (Exception ex)
            {
                
                return new ResetDataResult
                {
                    Message = $"Error while resetting the datas : {ex.Message}"
                };
            }
        }
    }
    
    
}




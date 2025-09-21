using Application.Common.Repositories;
using Domain.Entities;
using FluentValidation;
using MediatR;

namespace Application.Features.TableManager.Commands;

public class DeleteTableResult
{
    public string? Data { get; set; }
}

public class DeleteTableRequest : IRequest<DeleteTableResult>
{
    public string? Name { get; init; }
}

public class DeleteTableValidator : AbstractValidator<DeleteTableRequest>
{
    public DeleteTableValidator()
    {
        RuleFor(x => x.Name).NotEmpty();
    }
}

public class DeleteTableHandler : IRequestHandler<DeleteTableRequest, DeleteTableResult>
{
    private readonly IOrderRepository<string> _repository;
    private readonly IUnitOfWork _unitOfWork;

    public DeleteTableHandler(
        IOrderRepository<string> repository,
        IUnitOfWork unitOfWork
        )
    {
        _repository = repository;
        _unitOfWork = unitOfWork;
    }

    public async Task<DeleteTableResult> Handle(DeleteTableRequest request, CancellationToken cancellationToken)
    {
        await _repository.ClearTableAsync(request.Name ?? string.Empty, cancellationToken);
        await _unitOfWork.SaveAsync(cancellationToken);

        return new DeleteTableResult
        {
            Data = request.Name ?? string.Empty
        };
    }
}
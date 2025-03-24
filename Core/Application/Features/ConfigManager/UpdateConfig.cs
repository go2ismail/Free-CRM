using Application.Common.Repositories;
using AutoMapper;
using Domain.Entities;
using FluentValidation;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Features.ConfigManager;

public class UpdateConfigRequest : IRequest<UpdateConfigResult>
{
    public string? Id { get; init; }
    public string? Name { get; init; }
    public string? Value { get; init; }
    public string? UpdatedById { get; init; }
}

public class UpdateConfigResult
{
    public Config? Data { get; set; }
}

public class UpdateConfigValidator : AbstractValidator<UpdateConfigRequest>
{
    public UpdateConfigValidator()
    {
        RuleFor(x => x.Id).NotEmpty();
        RuleFor(x => x.Name).NotEmpty();
        RuleFor(x => x.Value).NotEmpty();
    }
}

public class UpdateConfigHandler : IRequestHandler<UpdateConfigRequest, UpdateConfigResult>
{
    private readonly ICommandRepository<Config> _repository;
    private readonly IUnitOfWork _unitOfWork;

    public UpdateConfigHandler(
        ICommandRepository<Config> repository,
        IUnitOfWork unitOfWork
    )
    {
        _repository = repository;
        _unitOfWork = unitOfWork;
    }

    public async Task<UpdateConfigResult> Handle(UpdateConfigRequest request, CancellationToken cancellationToken)
    {
        Console.WriteLine(request.Id);
        Console.WriteLine(request.Name);
        Console.WriteLine(request.Value);


        var entity = await _repository.GetAsync(request.Id ?? string.Empty, cancellationToken);

        if (entity == null)
        {
            throw new Exception($"Entity not found: {request.Id}");
        }

        entity.Name = request.Name;
        entity.Value = request.Value;
        entity.UpdatedById = request.UpdatedById;
        entity.UpdatedAtUtc = DateTime.UtcNow;

        _repository.Update(entity);
        await _unitOfWork.SaveAsync(cancellationToken);

        return new UpdateConfigResult
        {
            Data = entity
        };
    }
}
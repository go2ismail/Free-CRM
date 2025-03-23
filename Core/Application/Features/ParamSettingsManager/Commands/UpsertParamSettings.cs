using Application.Common.Repositories;
using Domain.Entities;
using FluentValidation;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Application.Features.ParamSettingsManager.Commands
{
    public class UpsertParamSettingsResult
    {
        public ParamSettings? Data { get; set; }
    }

    public class UpsertParamSettingsRequest : IRequest<UpsertParamSettingsResult>
    {
        public double? ParamValue { get; init; }
    }

    public class UpsertParamSettingsValidator : AbstractValidator<UpsertParamSettingsRequest>
    {
        public UpsertParamSettingsValidator()
        {
            RuleFor(x => x.ParamValue).NotNull();
        }
    }

    public class UpsertParamSettingsHandler : IRequestHandler<UpsertParamSettingsRequest, UpsertParamSettingsResult>
    {
        private readonly ICommandRepository<ParamSettings> _repository;
        private readonly IUnitOfWork _unitOfWork;

        public UpsertParamSettingsHandler(ICommandRepository<ParamSettings> repository, IUnitOfWork unitOfWork)
        {
            _repository = repository;
            _unitOfWork = unitOfWork;
        }

        public async Task<UpsertParamSettingsResult> Handle(UpsertParamSettingsRequest request, CancellationToken cancellationToken = default)
        {
            var existingEntity = await _repository
                .GetQuery()
                .Where(x => x.ParamName == "budgetalert" && !x.IsDeleted) 
                .SingleOrDefaultAsync(cancellationToken);
            ParamSettings entity;

            if (existingEntity != null)
            {
                entity = existingEntity;
                entity.ParamValue = request.ParamValue;
                _repository.Update(entity);
            }
            else
            {
                entity = new ParamSettings
                {
                    ParamName = "budgetalert",
                    ParamValue = request.ParamValue
                };
                await _repository.CreateAsync(entity, cancellationToken);
            }
            await _unitOfWork.SaveAsync(cancellationToken);

            return new UpsertParamSettingsResult
            {
                Data = entity
            };
        }
    }
}

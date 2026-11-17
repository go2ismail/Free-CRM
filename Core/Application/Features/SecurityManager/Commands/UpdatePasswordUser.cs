using Application.Common.Services.SecurityManager;
using FluentValidation;
using MediatR;
using System.Text.Json.Serialization;

namespace Application.Features.SecurityManager.Commands;


public class UpdatePasswordUserResult
{
    public string? Data { get; init; }
}

public class UpdatePasswordUserRequest : IRequest<UpdatePasswordUserResult>
{
    public string? UserId { get; init; }
    public string? NewPassword { get; init; }

    [JsonIgnore]
    public string? CallerUserId { get; init; }
}

public class UpdatePasswordUserValidator : AbstractValidator<UpdatePasswordUserRequest>
{
    public UpdatePasswordUserValidator()
    {
        RuleFor(x => x.UserId).NotEmpty();
        RuleFor(x => x.NewPassword).NotEmpty();
    }
}

public class UpdatePasswordUserHandler : IRequestHandler<UpdatePasswordUserRequest, UpdatePasswordUserResult>
{
    private readonly ISecurityService _securityService;

    public UpdatePasswordUserHandler(ISecurityService securityService)
    {
        _securityService = securityService;
    }

    public async Task<UpdatePasswordUserResult> Handle(UpdatePasswordUserRequest request, CancellationToken cancellationToken)
    {
        await _securityService.UpdatePasswordUserAsync(
            request.CallerUserId ?? "",
            request.UserId ?? "",
            request.NewPassword ?? "",
            cancellationToken
            );

        return new UpdatePasswordUserResult
        {
            Data = "Update Password Success"
        };
    }
}



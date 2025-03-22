using Application.Common.Services.FileDocumentManager;
using FluentValidation;
using MediatR;

namespace Application.Features.FileFileManager.Queries;


public class GetFileResult
{
    public string Data { get; init; }
}

public class GetFileRequest : IRequest<GetFileResult>
{
    public string? Name { get; init; }
}

public class GetFileValidator : AbstractValidator<GetFileRequest>
{
    public GetFileValidator()
    {
        RuleFor(x => x.Name)
            .NotEmpty();
    }
}

public class GetFileHandler : IRequestHandler<GetFileRequest, GetFileResult>
{
    private readonly IFileDocumentService _FileService;

    public GetFileHandler(IFileDocumentService FileService)
    {
        _FileService = FileService;
    }

    public async Task<GetFileResult> Handle(GetFileRequest request, CancellationToken cancellationToken)
    {
        var result = await _FileService.ExportTableToCsvAsync(request.Name ?? "", cancellationToken);

        return new GetFileResult { Data = result };
    }
}



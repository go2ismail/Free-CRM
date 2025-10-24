using Application.Features.ProjectManager.Commands;
using Application.Features.ProjectManager.Queries;
using ASPNET.BackEnd.Common.Base;
using ASPNET.BackEnd.Common.Models;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ASPNET.BackEnd.Controllers;

[Route("api/[controller]")]
public class ProjectController : BaseApiController
{
    public ProjectController(ISender sender) : base(sender)
    {
    }

    [Authorize]
    [HttpPost("CreateProject")]
    public async Task<ActionResult<ApiSuccessResult<CreateProjectResult>>> CreateProjectAsync(CreateProjectRequest request, CancellationToken cancellationToken)
    {
        var response = await _sender.Send(request, cancellationToken);

        return Ok(new ApiSuccessResult<CreateProjectResult>
        {
            Code = StatusCodes.Status200OK,
            Message = $"Success executing {nameof(CreateProjectAsync)}",
            Content = response
        });
    }

    [Authorize]
    [HttpPost("UpdateProject")]
    public async Task<ActionResult<ApiSuccessResult<UpdateProjectResult>>> UpdateProjectAsync(UpdateProjectRequest request, CancellationToken cancellationToken)
    {
        var response = await _sender.Send(request, cancellationToken);

        return Ok(new ApiSuccessResult<UpdateProjectResult>
        {
            Code = StatusCodes.Status200OK,
            Message = $"Success executing {nameof(UpdateProjectAsync)}",
            Content = response
        });
    }

    [Authorize]
    [HttpPost("DeleteProject")]
    public async Task<ActionResult<ApiSuccessResult<DeleteProjectResult>>> DeleteProjectAsync(DeleteProjectRequest request, CancellationToken cancellationToken)
    {
        var response = await _sender.Send(request, cancellationToken);

        return Ok(new ApiSuccessResult<DeleteProjectResult>
        {
            Code = StatusCodes.Status200OK,
            Message = $"Success executing {nameof(DeleteProjectAsync)}",
            Content = response
        });
    }

    [Authorize]
    [HttpGet("GetProjectList")]
    public async Task<ActionResult<ApiSuccessResult<GetProjectListResult>>> GetProjectListAsync(
        CancellationToken cancellationToken,
        [FromQuery] bool isDeleted = false
        )
    {
        var request = new GetProjectListRequest { IsDeleted = isDeleted };
        var response = await _sender.Send(request, cancellationToken);

        return Ok(new ApiSuccessResult<GetProjectListResult>
        {
            Code = StatusCodes.Status200OK,
            Message = $"Success executing {nameof(GetProjectListAsync)}",
            Content = response
        });
    }

    [Authorize]
    [HttpGet("GetProjectStatusList")]
    public async Task<ActionResult<ApiSuccessResult<GetProjectStatusListResult>>> GetProjectStatusListAsync(
        CancellationToken cancellationToken
        )
    {
        var request = new GetProjectStatusListRequest { };
        var response = await _sender.Send(request, cancellationToken);

        return Ok(new ApiSuccessResult<GetProjectStatusListResult>
        {
            Code = StatusCodes.Status200OK,
            Message = $"Success executing {nameof(GetProjectStatusListAsync)}",
            Content = response
        });
    }
}

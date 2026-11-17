using Application.Features.TodoItemManager.Commands;
using Application.Features.TodoItemManager.Queries;
using ASPNET.BackEnd.Common.Base;
using ASPNET.BackEnd.Common.Models;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ASPNET.BackEnd.Controllers;

[Route("api/[controller]")]
public class TodoItemController : BaseApiController
{
    public TodoItemController(ISender sender) : base(sender)
    {
    }

    [Authorize(Roles = "TodoItems")]
    [HttpPost("CreateTodoItem")]
    public async Task<ActionResult<ApiSuccessResult<CreateTodoItemResult>>> CreateTodoItemAsync(CreateTodoItemRequest request, CancellationToken cancellationToken)
    {
        var response = await _sender.Send(request, cancellationToken);

        return Ok(new ApiSuccessResult<CreateTodoItemResult>
        {
            Code = StatusCodes.Status200OK,
            Message = $"Success executing {nameof(CreateTodoItemAsync)}",
            Content = response
        });
    }

    [Authorize(Roles = "TodoItems")]
    [HttpPost("UpdateTodoItem")]
    public async Task<ActionResult<ApiSuccessResult<UpdateTodoItemResult>>> UpdateTodoItemAsync(UpdateTodoItemRequest request, CancellationToken cancellationToken)
    {
        var response = await _sender.Send(request, cancellationToken);

        return Ok(new ApiSuccessResult<UpdateTodoItemResult>
        {
            Code = StatusCodes.Status200OK,
            Message = $"Success executing {nameof(UpdateTodoItemAsync)}",
            Content = response
        });
    }

    [Authorize(Roles = "TodoItems")]
    [HttpPost("DeleteTodoItem")]
    public async Task<ActionResult<ApiSuccessResult<DeleteTodoItemResult>>> DeleteTodoItemAsync(DeleteTodoItemRequest request, CancellationToken cancellationToken)
    {
        var response = await _sender.Send(request, cancellationToken);

        return Ok(new ApiSuccessResult<DeleteTodoItemResult>
        {
            Code = StatusCodes.Status200OK,
            Message = $"Success executing {nameof(DeleteTodoItemAsync)}",
            Content = response
        });
    }

    [Authorize(Roles = "TodoItems")]
    [HttpGet("GetTodoItemSingle")]
    public async Task<ActionResult<ApiSuccessResult<GetTodoItemSingleResult>>> GetTodoItemSingleAsync(
        CancellationToken cancellationToken,
        [FromQuery] string id
        )
    {
        var request = new GetTodoItemSingleRequest { Id = id };
        var response = await _sender.Send(request, cancellationToken);

        return Ok(new ApiSuccessResult<GetTodoItemSingleResult>
        {
            Code = StatusCodes.Status200OK,
            Message = $"Success executing {nameof(GetTodoItemSingleAsync)}",
            Content = response
        });
    }

    [Authorize(Roles = "TodoItems")]
    [HttpGet("GetTodoItemList")]
    public async Task<ActionResult<ApiSuccessResult<GetTodoItemListResult>>> GetTodoItemListAsync(
        CancellationToken cancellationToken,
        [FromQuery] bool isDeleted = false
        )
    {
        var request = new GetTodoItemListRequest { IsDeleted = isDeleted };
        var response = await _sender.Send(request, cancellationToken);

        return Ok(new ApiSuccessResult<GetTodoItemListResult>
        {
            Code = StatusCodes.Status200OK,
            Message = $"Success executing {nameof(GetTodoItemListAsync)}",
            Content = response
        });
    }


}





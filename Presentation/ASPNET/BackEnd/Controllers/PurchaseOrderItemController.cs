using Application.Features.PurchaseOrderItemManager.Commands;
using Application.Features.PurchaseOrderItemManager.Queries;
using ASPNET.BackEnd.Common.Base;
using ASPNET.BackEnd.Common.Models;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ASPNET.BackEnd.Controllers;

[Route("api/[controller]")]
public class PurchaseOrderItemController : BaseApiController
{
    public PurchaseOrderItemController(ISender sender) : base(sender)
    {
    }

    [Authorize(Roles = "PurchaseOrders")]
    [HttpPost("CreatePurchaseOrderItem")]
    public async Task<ActionResult<ApiSuccessResult<CreatePurchaseOrderItemResult>>> CreatePurchaseOrderItemAsync(CreatePurchaseOrderItemRequest request, CancellationToken cancellationToken)
    {
        var response = await _sender.Send(request, cancellationToken);

        return Ok(new ApiSuccessResult<CreatePurchaseOrderItemResult>
        {
            Code = StatusCodes.Status200OK,
            Message = $"Success executing {nameof(CreatePurchaseOrderItemAsync)}",
            Content = response
        });
    }

    [Authorize(Roles = "PurchaseOrders")]
    [HttpPost("UpdatePurchaseOrderItem")]
    public async Task<ActionResult<ApiSuccessResult<UpdatePurchaseOrderItemResult>>> UpdatePurchaseOrderItemAsync(UpdatePurchaseOrderItemRequest request, CancellationToken cancellationToken)
    {
        var response = await _sender.Send(request, cancellationToken);

        return Ok(new ApiSuccessResult<UpdatePurchaseOrderItemResult>
        {
            Code = StatusCodes.Status200OK,
            Message = $"Success executing {nameof(UpdatePurchaseOrderItemAsync)}",
            Content = response
        });
    }

    [Authorize(Roles = "PurchaseOrders")]
    [HttpPost("DeletePurchaseOrderItem")]
    public async Task<ActionResult<ApiSuccessResult<DeletePurchaseOrderItemResult>>> DeletePurchaseOrderItemAsync(DeletePurchaseOrderItemRequest request, CancellationToken cancellationToken)
    {
        var response = await _sender.Send(request, cancellationToken);

        return Ok(new ApiSuccessResult<DeletePurchaseOrderItemResult>
        {
            Code = StatusCodes.Status200OK,
            Message = $"Success executing {nameof(DeletePurchaseOrderItemAsync)}",
            Content = response
        });
    }

    [Authorize(Roles = "PurchaseOrders,PurchaseReports")]
    [HttpGet("GetPurchaseOrderItemList")]
    public async Task<ActionResult<ApiSuccessResult<GetPurchaseOrderItemListResult>>> GetPurchaseOrderItemListAsync(
        CancellationToken cancellationToken,
        [FromQuery] bool isDeleted = false
        )
    {
        var request = new GetPurchaseOrderItemListRequest { IsDeleted = isDeleted };
        var response = await _sender.Send(request, cancellationToken);

        return Ok(new ApiSuccessResult<GetPurchaseOrderItemListResult>
        {
            Code = StatusCodes.Status200OK,
            Message = $"Success executing {nameof(GetPurchaseOrderItemListAsync)}",
            Content = response
        });
    }

    [Authorize(Roles = "PurchaseOrders,PurchaseReports")]
    [HttpGet("GetPurchaseOrderItemByPurchaseOrderIdList")]
    public async Task<ActionResult<ApiSuccessResult<GetPurchaseOrderItemByPurchaseOrderIdListResult>>> GetPurchaseOrderItemByPurchaseOrderIdListAsync(
    CancellationToken cancellationToken,
    [FromQuery] string purchaseOrderId
    )
    {
        var request = new GetPurchaseOrderItemByPurchaseOrderIdListRequest { PurchaseOrderId = purchaseOrderId };
        var response = await _sender.Send(request, cancellationToken);

        return Ok(new ApiSuccessResult<GetPurchaseOrderItemByPurchaseOrderIdListResult>
        {
            Code = StatusCodes.Status200OK,
            Message = $"Success executing {nameof(GetPurchaseOrderItemByPurchaseOrderIdListAsync)}",
            Content = response
        });
    }


}





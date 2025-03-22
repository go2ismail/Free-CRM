using Application.Features.FileFileManager.Queries;
using Application.Features.TableManager.Commands;
using Application.Features.TableManager.Queries;
using ASPNET.BackEnd.Common.Base;
using ASPNET.BackEnd.Common.Models;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ASPNET.BackEnd.Controllers;

[Route("api/[controller]")]
public class TableController : BaseApiController
{
    public TableController(ISender sender) : base(sender)
    {
    }
    
    [Authorize]
    [HttpPost("DeleteTable")]
    public async Task<ActionResult<ApiSuccessResult<DeleteTableResult>>> DeleteTableAsync(DeleteTableRequest request, CancellationToken cancellationToken)
    {
        var response = await _sender.Send(request, cancellationToken);

        return Ok(new ApiSuccessResult<DeleteTableResult>
        {
            Code = StatusCodes.Status200OK,
            Message = $"Success executing {nameof(DeleteTableAsync)}",
            Content = response
        });
    }

    [Authorize]
    [HttpGet("GetTableList")]
    public async Task<ActionResult<ApiSuccessResult<GetTableListResult>>> GetTableListAsync(
        CancellationToken cancellationToken
        )
    {
        var request = new GetTableListRequest();
        var response = await _sender.Send(request, cancellationToken);

        return Ok(new ApiSuccessResult<GetTableListResult>
        {
            Code = StatusCodes.Status200OK,
            Message = $"Success executing {nameof(GetTableListAsync)}",
            Content = response
        });
    }
    
    [Authorize]
    [HttpPost("ExportTable")]
    public async Task<ActionResult<GetFileResult>> ExportTableAsync(GetFileRequest request, CancellationToken cancellationToken)
    {
        
        try
        {
            var result = await _sender.Send(request, cancellationToken);
            
            if (result?.Data == null)
            {
                return StatusCode(500, "No data found in the table.");
            }
            
            return Ok(new ApiSuccessResult<GetFileResult>
            {
                Code = StatusCodes.Status200OK,
                Message = $"Success executing {nameof(ExportTableAsync)}",
                Content = result
            });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new
            {
                Message = "An error occurred while exporting the table.",
                ErrorDetails = ex.Message
            });
        }
    }
    
    [Authorize]
    [HttpPost("ImportTable")]
    public async Task<ActionResult<ImportFileResult>> ImportTableAsync([FromForm] IFormFile file, [FromForm] string name, CancellationToken cancellationToken)
    {
        try
        {
            if (file == null || file.Length == 0)
            {
                return BadRequest(new { Message = "No file provided or file is empty." });
            }

            using var memoryStream = new MemoryStream();
            await file.CopyToAsync(memoryStream, cancellationToken);
            byte[] fileBytes = memoryStream.ToArray();

            var request = new ImportFileRequest
            {
                Name = name,
                CsvData = fileBytes
            };

            var result = await _sender.Send(request, cancellationToken);

            if (result == null)
            {
                return StatusCode(500, "No data found in the CSV file.");
            }

            return Ok(new ApiSuccessResult<ImportFileResult>
            {
                Code = StatusCodes.Status200OK,
                Message = $"Success executing {nameof(ImportTableAsync)}",
                Content = result
            });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new
            {
                Message = "An error occurred while importing data into the table.",
                ErrorDetails = ex.Message
            });
        }
    }

}



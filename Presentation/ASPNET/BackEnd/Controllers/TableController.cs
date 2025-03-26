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
    
    public class ImportTableRequest
    {
        public IFormFile File { get; set; }
        
        public string Name { get; set; }
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
    public async Task<ActionResult<ImportFileResult>> ImportTableAsync([FromForm] ImportTableRequest requete, CancellationToken cancellationToken)
    {
        try
        {
            if (requete.File == null || requete.File.Length == 0)
            {
                return BadRequest(new { Message = "No file provided or file is empty." });
            }

            using var memoryStream = new MemoryStream();
            await requete.File.CopyToAsync(memoryStream, cancellationToken);
            byte[] fileBytes = memoryStream.ToArray();

            var request = new ImportFileRequest
            {
                Name = requete.Name,
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
    
    [Authorize]
    [HttpPost("ImportDataTables")]
    public async Task<ActionResult<ImportFileResult>> ImportDataTablesAsync([FromForm]string iduser,List<IFormFile> files, CancellationToken cancellationToken)
    {
        try
        {
            if (files == null || files.Count == 0)
            {
                return BadRequest(new { Message = "No files provided or files are empty." });
            }

            var fileNames = new List<string>();
            var csvDataList = new List<byte[]>();

            foreach (var file in files)
            {
                if (file.Length == 0)
                {
                    return BadRequest(new { Message = $"File {file.FileName} is empty." });
                }

                using var memoryStream = new MemoryStream();
                await file.CopyToAsync(memoryStream, cancellationToken);
                csvDataList.Add(memoryStream.ToArray());
                fileNames.Add(file.FileName);
            }

            var request = new ImportFileDataRequest
            {
                CsvData = csvDataList,
                CreatedById = iduser,
                FileName = fileNames
            };

            var result = await _sender.Send(request, cancellationToken);

            if (result == null)
            {
                return StatusCode(500, "No data found in the CSV files.");
            }

            return Ok(new ApiSuccessResult<ImportFileResult>
            {
                Code = StatusCodes.Status200OK,
                Message = $"Success executing {nameof(ImportDataTablesAsync)}",
                Content = result
            });
        }
        catch (AggregateException ex)
        {
            var errorDetails = string.Join("; ", ex.InnerExceptions.Select(e => e.Message));
            return StatusCode(400, new
            {
                Message = "Validation errors occurred while importing data.",
                ErrorDetails = errorDetails
            });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new
            {
                Message = "An error occurred while importing data into the tables.",
                ErrorDetails = ex.Message
            });
        }
    }

}



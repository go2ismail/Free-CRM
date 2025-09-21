using Application.Features.ExpenseManager.Commands;
using Application.Features.FileDocumentManager.Commands;
using Application.Features.FileDocumentManager.Queries;
using ASPNET.BackEnd.Common.Base;
using ASPNET.BackEnd.Common.Models;
using Infrastructure.DataAccessManager.EFCore.Contexts;
using Infrastructure.FileDocumentManager;
using Infrastructure.Utils;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;


namespace ASPNET.BackEnd.Controllers
{
    [Route("api/[controller]")]
    public class ImportCsvController : BaseApiController
    {
        DataContext _context;
        ImportService _importService;
        public ImportCsvController(ISender sender, DataContext dataContext, ImportService importService) : base(sender)
        {
            _context = dataContext;
            _importService = importService;
        }

        [Authorize]
        [HttpPost("UploadCsv")]
        public async Task<ActionResult<ApiSuccessResult<object>>> UploadDocumentAsync(UploadRequest uploadRequest, CancellationToken cancellationToken)
        {
            IFormFile fileCamp = uploadRequest.fileCamp;
            IFormFile fileRes = uploadRequest.fileRes;

            if (fileCamp == null || fileCamp.Length == 0 || fileRes == null || fileRes.Length == 0)
            {
                return BadRequest("Invalid file.");
            }

            Console.WriteLine("separator");
            Console.WriteLine(uploadRequest.separator);
            Console.WriteLine(uploadRequest.dateFormat);

            // Process fileCamp
            byte[] fileDataCamp;
            using (var memoryStream = new MemoryStream())
            {
                await fileCamp.CopyToAsync(memoryStream, cancellationToken);
                fileDataCamp = memoryStream.ToArray();
            }

            var extensionCamp = Path.GetExtension(fileCamp.FileName).TrimStart('.');
            var commandCamp = new CreateDocumentRequest
            {
                OriginalFileName = fileCamp.FileName,
                Extension = extensionCamp,
                Data = fileDataCamp,
                Size = fileDataCamp.Length
            };

            // Process fileRes
            byte[] fileDataRes;
            using (var memoryStream = new MemoryStream())
            {
                await fileRes.CopyToAsync(memoryStream, cancellationToken);
                fileDataRes = memoryStream.ToArray();
            }

            var extensionRes = Path.GetExtension(fileRes.FileName).TrimStart('.');
            var commandRes = new CreateDocumentRequest
            {
                OriginalFileName = fileRes.FileName,
                Extension = extensionRes,
                Data = fileDataRes,
                Size = fileDataRes.Length
            };

            if (extensionCamp.ToLower() == "csv" && extensionRes.ToLower() == "csv")
            {
                CsvProcessingCampaignResult dataCamp = new CsvProcessingCampaignResult();
                CsvProcessingResult dataRes = new CsvProcessingResult();
                try
                {
                    MethodeFile methodeFile = new MethodeFile(_importService);
                    dataCamp = methodeFile.ReadCsvFileCampaigne(commandCamp, uploadRequest.separator);
                    

                    dataRes = methodeFile.ReadCsvFile(commandRes, uploadRequest.separator, uploadRequest.dateFormat,dataCamp.SuccessfulRecords);



                    Console.WriteLine("catchcatchcatchcatchcatchcatch tsisy");
                    if (dataCamp.ErrorRecords.Count > 0)
                    {
                        return Ok(new ApiSuccessResult<CreateExpenseResult>
                        {
                            Code = 407,
                            Message = dataCamp.GetMessageError(),
                            Content = null
                        });
                    }
                    else if (dataRes.ErrorRecords.Count > 0)
                    {
                        return Ok(new ApiSuccessResult<CreateExpenseResult>
                        {
                            Code = 407,
                            Message = dataRes.GetMessageError(),
                            Content = null
                        });
                    }


                    var (camps,exps,budgets)=methodeFile.saveDataImport(dataCamp.SuccessfulRecords, dataRes.SuccessfulRecords, _context);

                    return Ok(new ApiSuccessResult<object>
                    {
                        Code = StatusCodes.Status200OK,
                        Message = $"Les donner enregistrer Campaign({camps.Count}), Budget({budgets.Count}), Expense({exps.Count})",
                        Content = null
                    });
                }
                catch (Exception e)
                {
                    Console.WriteLine("catchcatchcatchcatchcatchcatch", e.Message);
                    if (dataCamp.ErrorRecords.Count > 0)
                    {
                        return Ok(new ApiSuccessResult<CreateExpenseResult>
                        {
                            Code = 407,
                            Message = dataCamp.GetMessageError(),
                            Content = null
                        });
                    }
                    else if(dataRes.ErrorRecords.Count > 0)
                    {
                        return Ok(new ApiSuccessResult<CreateExpenseResult>
                        {
                            Code = 407,
                            Message = dataRes.GetMessageError(),
                            Content = null
                        });
                    }
                    else
                    {
                        throw new Exception("Error");
                    }

                }
            }
            else
            {
                return BadRequest("Invalid file format.");
            }
        }

        [Authorize]
        [HttpGet("GetDocument")]
        public async Task<IActionResult> GetDocumentAsync(
            [FromQuery] string documentName,
            CancellationToken cancellationToken)
        {
            if (string.IsNullOrEmpty(documentName) || Path.GetExtension(documentName) == string.Empty)
            {
                documentName = "nodocument.txt";
            }

            var request = new GetDocumentRequest
            {
                DocumentName = documentName
            };

            var result = await _sender.Send(request, cancellationToken);

            if (result?.Data == null)
            {
                return NotFound("Document not found.");
            }

            var extension = Path.GetExtension(documentName).ToLower();
            var mimeType = FileDocumentHelper.GetMimeType(extension);

            return File(result.Data, mimeType);
        }
    }
}

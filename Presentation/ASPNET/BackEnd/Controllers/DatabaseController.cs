using Application.Features.FileDocumentManager.Commands;
using ASPNET.BackEnd.Common.Base;
using ASPNET.BackEnd.Common.Models;
using Infrastructure.DataAccessManager.EFCore.Contexts;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ASPNET.BackEnd.Controllers
{
    [Route("api/[controller]")]
    public class DatabaseController : BaseApiController
    {
        private readonly DataContext _dataContext;

        public DatabaseController(ISender sender, DataContext dataContext) : base(sender)
        {
            _dataContext = dataContext;
        }
        
        [Authorize]
        [HttpGet("Initialize")]
        public async Task<IActionResult> InitialiseDatabaseAsync(CancellationToken cancellationToken)
        {
            await _dataContext.ClearDatabaseAsync(cancellationToken);
            
            return Ok(new ApiSuccessResult<string>
            {
                Code = StatusCodes.Status200OK,
                Message = "Database cleared successfully",
                Content = "Database cleared"
            });
        }
    }
}
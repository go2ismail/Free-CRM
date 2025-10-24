using Domain.Common;
using Domain.Enums;

namespace Domain.Entities;

public class Project : BaseEntity
{
    public string? Number { get; set; }
    public string? Title { get; set; }
    public string? Description { get; set; }
    public DateTime? ProjectDateStart { get; set; }
    public DateTime? ProjectDateFinish { get; set; }
    public ProjectStatus? Status { get; set; }
    public string? SalesTeamId { get; set; }
    public SalesTeam? SalesTeam { get; set; }
}

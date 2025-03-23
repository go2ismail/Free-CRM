using Domain.Common;

namespace Domain.Entities;

public class ParamSettings : BaseEntity
{
    public string? ParamName { get; set; }
    public double? ParamValue { get; set; }
}
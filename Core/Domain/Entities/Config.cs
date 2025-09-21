using Domain.Common;
using Domain.Enums;

namespace Domain.Entities;

public class Config : BaseEntity
{
    public string? Name { get; set; }
    public string? Value { get; set; }
}


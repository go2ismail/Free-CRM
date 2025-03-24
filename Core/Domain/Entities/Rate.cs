using Domain.Common;

namespace Domain.Entities;

public class Rate : BaseEntity
{
    public double? Ratio { get; set; }
    public DateTime? ValidateDate { get; set; }
    public DateTime? ExpiringeDate { get; set; }
}
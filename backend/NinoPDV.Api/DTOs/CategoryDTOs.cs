using System;
using System.Collections.Generic;

namespace NinoPDV.Api.DTOs
{
    public record CategoryRequest(string Name, string? Description, Guid? ParentCategoryId = null, string? ImageBase64 = null);
    
    public record ReorderCategoriesRequest(List<Guid> OrderedIds);
}

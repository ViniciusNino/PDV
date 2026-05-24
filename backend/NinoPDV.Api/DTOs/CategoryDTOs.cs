using System;
using System.Collections.Generic;

namespace NinoPDV.Api.DTOs
{
    public record CategoryRequest(string Name, string? Description, Guid? ParentCategoryId = null, string? ImageBase64 = null);
    
    public record CategoryReorderItem(Guid Id, int Sequence);
    public record ReorderCategoriesRequest(List<CategoryReorderItem> Items);
}

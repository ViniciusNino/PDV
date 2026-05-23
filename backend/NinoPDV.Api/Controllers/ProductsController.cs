using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using NinoPDV.Api.Data;
using NinoPDV.Api.DTOs;
using NinoPDV.Api.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace NinoPDV.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class ProductsController : ControllerBase
    {
        private readonly AppDbContext _context;

        public ProductsController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<ProductResponseDTO>>> GetProducts()
        {
            var products = await _context.Products
                .Include(p => p.Category)
                .AsNoTracking()
                .ToListAsync();

            var dtos = products.Select(p => new ProductResponseDTO
            {
                Id = p.Id,
                Name = p.Name,
                Description = p.Description,
                Type = p.Type,
                BasePrice = p.BasePrice,
                CostPrice = p.CostPrice,
                Unit = p.Unit,
                IsFractionable = p.IsFractionable,
                ImageBase64 = p.ImageBase64,
                Barcode = p.Barcode,
                IsActive = p.IsActive,
                IsVisible = p.IsVisible,
                CategoryId = p.CategoryId,
                CategoryName = p.Category.Name,
                CreatedAt = p.CreatedAt,
                UpdatedAt = p.UpdatedAt
            }).ToList();

            return Ok(dtos);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<ProductResponseDTO>> GetProduct(Guid id)
        {
            var product = await _context.Products
                .Include(p => p.Category)
                .Include(p => p.Prices)
                .Include(p => p.Ingredients)
                .Include(p => p.ComboItems)
                .Include(p => p.ModifierGroups)
                    .ThenInclude(mg => mg.Options)
                .AsNoTracking()
                .FirstOrDefaultAsync(p => p.Id == id);

            if (product == null)
            {
                return NotFound();
            }

            var dto = new ProductResponseDTO
            {
                Id = product.Id,
                Name = product.Name,
                Description = product.Description,
                Type = product.Type,
                BasePrice = product.BasePrice,
                CostPrice = product.CostPrice,
                Unit = product.Unit,
                IsFractionable = product.IsFractionable,
                ImageBase64 = product.ImageBase64,
                Barcode = product.Barcode,
                IsActive = product.IsActive,
                IsVisible = product.IsVisible,
                CategoryId = product.CategoryId,
                CategoryName = product.Category.Name,
                CreatedAt = product.CreatedAt,
                UpdatedAt = product.UpdatedAt,
                Prices = product.Prices.Select(p => new ProductPriceDTO { Channel = p.Channel, Price = p.Price }).ToList(),
                Ingredients = product.Ingredients.Select(i => new ProductCompositionDTO { IngredientProductId = i.IngredientProductId, Quantity = i.Quantity }).ToList(),
                ComboItems = product.ComboItems.Select(c => new ProductComboDTO { ChildProductId = c.ChildProductId, Quantity = c.Quantity, FixedPrice = c.FixedPrice }).ToList(),
                ModifierGroups = product.ModifierGroups.Select(mg => new ModifierGroupDTO
                {
                    Id = mg.Id,
                    Name = mg.Name,
                    MinSelections = mg.MinSelections,
                    MaxSelections = mg.MaxSelections,
                    PriceRule = mg.PriceRule,
                    Sequence = mg.Sequence,
                    Options = mg.Options.Select(o => new ModifierOptionDTO
                    {
                        Id = o.Id,
                        ProductId = o.ProductId,
                        Name = o.Name,
                        AdditionalPrice = o.AdditionalPrice,
                        MaxQuantity = o.MaxQuantity,
                        Sequence = o.Sequence
                    }).ToList()
                }).ToList()
            };

            return Ok(dto);
        }

        [HttpPost]
        public async Task<ActionResult<ProductResponseDTO>> CreateProduct(ProductRequestDTO request)
        {
            var category = await _context.Categories.FindAsync(request.CategoryId);
            if (category == null)
                return BadRequest("Categoria inválida.");

            var product = new Product
            {
                Name = request.Name,
                Description = request.Description,
                Type = request.Type,
                BasePrice = request.BasePrice,
                CostPrice = request.CostPrice,
                Unit = request.Unit,
                IsFractionable = request.IsFractionable,
                ImageBase64 = request.ImageBase64,
                Barcode = request.Barcode,
                IsActive = request.IsActive,
                IsVisible = request.IsVisible,
                CategoryId = request.CategoryId
            };

            // Map sub-collections
            product.Prices = request.Prices.Select(p => new ProductPrice { Channel = p.Channel, Price = p.Price }).ToList();
            product.Ingredients = request.Ingredients.Select(i => new ProductComposition { IngredientProductId = i.IngredientProductId, Quantity = i.Quantity }).ToList();
            product.ComboItems = request.ComboItems.Select(c => new ProductCombo { ChildProductId = c.ChildProductId, Quantity = c.Quantity, FixedPrice = c.FixedPrice }).ToList();
            
            product.ModifierGroups = request.ModifierGroups.Select(mg => new ModifierGroup
            {
                Name = mg.Name,
                MinSelections = mg.MinSelections,
                MaxSelections = mg.MaxSelections,
                PriceRule = mg.PriceRule,
                Sequence = mg.Sequence,
                Options = mg.Options.Select(o => new ModifierOption
                {
                    ProductId = o.ProductId,
                    Name = o.Name,
                    AdditionalPrice = o.AdditionalPrice,
                    MaxQuantity = o.MaxQuantity,
                    Sequence = o.Sequence
                }).ToList()
            }).ToList();

            _context.Products.Add(product);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetProduct), new { id = product.Id }, null);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateProduct(Guid id, ProductRequestDTO request)
        {
            var product = await _context.Products
                .Include(p => p.Prices)
                .Include(p => p.Ingredients)
                .Include(p => p.ComboItems)
                .Include(p => p.ModifierGroups)
                    .ThenInclude(mg => mg.Options)
                .FirstOrDefaultAsync(p => p.Id == id);

            if (product == null)
                return NotFound();

            if (product.CategoryId != request.CategoryId)
            {
                var categoryExists = await _context.Categories.AnyAsync(c => c.Id == request.CategoryId);
                if (!categoryExists) return BadRequest("Categoria inválida.");
                product.CategoryId = request.CategoryId;
            }

            product.Name = request.Name;
            product.Description = request.Description;
            product.Type = request.Type;
            product.BasePrice = request.BasePrice;
            product.CostPrice = request.CostPrice;
            product.Unit = request.Unit;
            product.IsFractionable = request.IsFractionable;
            product.ImageBase64 = request.ImageBase64;
            product.Barcode = request.Barcode;
            product.IsActive = request.IsActive;
            product.IsVisible = request.IsVisible;

            // Update Prices (Full replace is fine since they have no nested dependencies)
            _context.ProductPrices.RemoveRange(product.Prices);
            product.Prices = request.Prices.Select(p => new ProductPrice { Channel = p.Channel, Price = p.Price }).ToList();

            // Update Ingredients (Full replace)
            _context.ProductCompositions.RemoveRange(product.Ingredients);
            product.Ingredients = request.Ingredients.Select(i => new ProductComposition { IngredientProductId = i.IngredientProductId, Quantity = i.Quantity }).ToList();

            // Update ComboItems (Full replace)
            _context.ProductCombos.RemoveRange(product.ComboItems);
            product.ComboItems = request.ComboItems.Select(c => new ProductCombo { ChildProductId = c.ChildProductId, Quantity = c.Quantity, FixedPrice = c.FixedPrice }).ToList();

            // Update Modifier Groups (Diff logic to prevent breaking foreign keys if used elsewhere)
            var existingGroups = product.ModifierGroups.ToList();
            var newGroupIds = request.ModifierGroups.Where(mg => mg.Id.HasValue).Select(mg => mg.Id.Value).ToList();

            // Remove deleted groups
            var groupsToRemove = existingGroups.Where(mg => !newGroupIds.Contains(mg.Id)).ToList();
            _context.ModifierGroups.RemoveRange(groupsToRemove);

            foreach (var reqMg in request.ModifierGroups)
            {
                if (reqMg.Id.HasValue && existingGroups.Any(mg => mg.Id == reqMg.Id))
                {
                    // Update existing group
                    var existingGroup = existingGroups.First(mg => mg.Id == reqMg.Id);
                    existingGroup.Name = reqMg.Name;
                    existingGroup.MinSelections = reqMg.MinSelections;
                    existingGroup.MaxSelections = reqMg.MaxSelections;
                    existingGroup.PriceRule = reqMg.PriceRule;
                    existingGroup.Sequence = reqMg.Sequence;

                    // Update options for this group
                    var existingOptions = existingGroup.Options.ToList();
                    var newOptionIds = reqMg.Options.Where(o => o.Id.HasValue).Select(o => o.Id.Value).ToList();
                    
                    var optionsToRemove = existingOptions.Where(o => !newOptionIds.Contains(o.Id)).ToList();
                    _context.ModifierOptions.RemoveRange(optionsToRemove);

                    foreach (var reqOpt in reqMg.Options)
                    {
                        if (reqOpt.Id.HasValue && existingOptions.Any(o => o.Id == reqOpt.Id))
                        {
                            var existingOpt = existingOptions.First(o => o.Id == reqOpt.Id);
                            existingOpt.Name = reqOpt.Name;
                            existingOpt.ProductId = reqOpt.ProductId;
                            existingOpt.AdditionalPrice = reqOpt.AdditionalPrice;
                            existingOpt.MaxQuantity = reqOpt.MaxQuantity;
                            existingOpt.Sequence = reqOpt.Sequence;
                        }
                        else
                        {
                            existingGroup.Options.Add(new ModifierOption
                            {
                                Name = reqOpt.Name,
                                ProductId = reqOpt.ProductId,
                                AdditionalPrice = reqOpt.AdditionalPrice,
                                MaxQuantity = reqOpt.MaxQuantity,
                                Sequence = reqOpt.Sequence
                            });
                        }
                    }
                }
                else
                {
                    // Add new group
                    product.ModifierGroups.Add(new ModifierGroup
                    {
                        Name = reqMg.Name,
                        MinSelections = reqMg.MinSelections,
                        MaxSelections = reqMg.MaxSelections,
                        PriceRule = reqMg.PriceRule,
                        Sequence = reqMg.Sequence,
                        Options = reqMg.Options.Select(o => new ModifierOption
                        {
                            Name = o.Name,
                            ProductId = o.ProductId,
                            AdditionalPrice = o.AdditionalPrice,
                            MaxQuantity = o.MaxQuantity,
                            Sequence = o.Sequence
                        }).ToList()
                    });
                }
            }

            await _context.SaveChangesAsync();
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteProduct(Guid id)
        {
            var product = await _context.Products.FindAsync(id);
            if (product == null)
                return NotFound();

            _context.Products.Remove(product);
            
            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateException)
            {
                return BadRequest("Não é possível excluir este produto, pois ele está associado a outras tabelas (Ex: é ingrediente de outro produto ou faz parte do histórico de vendas).");
            }

            return NoContent();
        }
    }
}

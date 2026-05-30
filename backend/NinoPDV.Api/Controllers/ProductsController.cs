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
                Code = p.Code,
                Abbreviation = p.Abbreviation,
                PrintTarget = p.PrintTarget,
                IsActive = p.IsActive,
                IsVisible = p.IsVisible,
                CategoryId = p.CategoryId,
                CategoryName = p.Category.Name,
                CreatedAt = p.CreatedAt,
                UpdatedAt = p.UpdatedAt,
                PreparationTime = p.PreparationTime,
                ControlStock = p.ControlStock,
                StockSectorId = p.StockSectorId,
                MinStock = p.MinStock,
                MaxStock = p.MaxStock,
                StockContent = p.StockContent,
                IsDivisible = p.IsDivisible,
                IsPerishable = p.IsPerishable,
                IsAutoWeight = p.IsAutoWeight
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
                .Include(p => p.Promotions)
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
                Code = product.Code,
                Abbreviation = product.Abbreviation,
                PrintTarget = product.PrintTarget,
                IsActive = product.IsActive,
                IsVisible = product.IsVisible,
                CategoryId = product.CategoryId,
                CategoryName = product.Category.Name,
                CreatedAt = product.CreatedAt,
                UpdatedAt = product.UpdatedAt,
                PreparationTime = product.PreparationTime,
                ControlStock = product.ControlStock,
                StockSectorId = product.StockSectorId,
                MinStock = product.MinStock,
                MaxStock = product.MaxStock,
                StockContent = product.StockContent,
                IsDivisible = product.IsDivisible,
                IsPerishable = product.IsPerishable,
                IsAutoWeight = product.IsAutoWeight,
                Prices = product.Prices.Select(p => new ProductPriceDTO { Channel = p.Channel, Price = p.Price, IsVisible = p.IsVisible }).ToList(),
                Ingredients = product.Ingredients.Select(i => new ProductCompositionDTO { IngredientProductId = i.IngredientProductId, Quantity = i.Quantity, Type = i.Type, AdditionalPrice = i.AdditionalPrice, IsActive = i.IsActive }).ToList(),
                ComboItems = product.ComboItems.Select(c => new ProductComboDTO { ChildProductId = c.ChildProductId, Quantity = c.Quantity, FixedPrice = c.FixedPrice }).ToList(),
                Promotions = product.Promotions.Select(promo => new ProductPromotionDTO
                {
                    Id = promo.Id,
                    DayStart = promo.DayStart,
                    HourStart = promo.HourStart,
                    DayEnd = promo.DayEnd,
                    HourEnd = promo.HourEnd,
                    Price = promo.Price,
                    IsSaleForbidden = promo.IsSaleForbidden
                }).ToList(),
                ModifierGroups = product.ModifierGroups.Select(mg => new ModifierGroupDTO
                {
                    Id = mg.Id,
                    Name = mg.Name,
                    MinSelections = mg.MinSelections,
                    MaxSelections = mg.MaxSelections,
                    PriceRule = mg.PriceRule,
                    Sequence = mg.Sequence,
                    IsPropType = mg.IsPropType,
                    CanBeFractioned = mg.CanBeFractioned,
                    Options = mg.Options.Select(o => new ModifierOptionDTO
                    {
                        Id = o.Id,
                        ProductId = o.ProductId,
                        Name = o.Name,
                        AdditionalPrice = o.AdditionalPrice,
                        BasePrice = o.BasePrice,
                        TotalPrice = o.TotalPrice,
                        MinQuantity = o.MinQuantity,
                        MaxQuantity = o.MaxQuantity,
                        Sequence = o.Sequence,
                        IsPreSelected = o.IsPreSelected,
                        IsVisible = o.IsVisible,
                        Abbreviation = o.Abbreviation,
                        ParentOptionId = o.ParentOptionId
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
                Code = request.Code,
                Abbreviation = request.Abbreviation,
                PrintTarget = request.PrintTarget,
                IsActive = request.IsActive,
                IsVisible = request.IsVisible,
                CategoryId = request.CategoryId,
                PreparationTime = request.PreparationTime,
                ControlStock = request.ControlStock,
                StockSectorId = request.StockSectorId,
                MinStock = request.MinStock,
                MaxStock = request.MaxStock,
                StockContent = request.StockContent,
                IsDivisible = request.IsDivisible,
                IsPerishable = request.IsPerishable,
                IsAutoWeight = request.IsAutoWeight
            };

            // Map sub-collections
            product.Prices = request.Prices.Select(p => new ProductPrice { Channel = p.Channel, Price = p.Price, IsVisible = p.IsVisible }).ToList();
            product.Ingredients = request.Ingredients.Select(i => new ProductComposition { IngredientProductId = i.IngredientProductId, Quantity = i.Quantity, Type = i.Type, AdditionalPrice = i.AdditionalPrice, IsActive = i.IsActive }).ToList();
            product.ComboItems = request.ComboItems.Select(c => new ProductCombo { ChildProductId = c.ChildProductId, Quantity = c.Quantity, FixedPrice = c.FixedPrice }).ToList();
            product.Promotions = request.Promotions.Select(promo => new ProductPromotion
            {
                Id = promo.Id ?? Guid.NewGuid(),
                DayStart = promo.DayStart,
                HourStart = promo.HourStart,
                DayEnd = promo.DayEnd,
                HourEnd = promo.HourEnd,
                Price = promo.Price,
                IsSaleForbidden = promo.IsSaleForbidden
            }).ToList();
            
            product.ModifierGroups = request.ModifierGroups.Select(mg => {
                var group = new ModifierGroup
                {
                    Id = mg.Id ?? Guid.NewGuid(),
                    Name = mg.Name,
                    MinSelections = mg.MinSelections,
                    MaxSelections = mg.MaxSelections,
                    PriceRule = mg.PriceRule,
                    Sequence = mg.Sequence,
                    IsPropType = mg.IsPropType,
                    CanBeFractioned = mg.CanBeFractioned
                };
                group.Options = mg.Options.Select(o => new ModifierOption
                {
                    Id = o.Id ?? Guid.NewGuid(),
                    ProductId = o.ProductId,
                    Name = o.Name,
                    AdditionalPrice = o.AdditionalPrice,
                    BasePrice = o.BasePrice,
                    TotalPrice = o.TotalPrice,
                    MinQuantity = o.MinQuantity,
                    MaxQuantity = o.MaxQuantity,
                    Sequence = o.Sequence,
                    IsPreSelected = o.IsPreSelected,
                    IsVisible = o.IsVisible,
                    Abbreviation = o.Abbreviation,
                    ParentOptionId = o.ParentOptionId
                }).ToList();
                return group;
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
                .Include(p => p.Promotions)
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
            product.Code = request.Code;
            product.Abbreviation = request.Abbreviation;
            product.PrintTarget = request.PrintTarget;
            product.IsActive = request.IsActive;
            product.IsVisible = request.IsVisible;
            product.PreparationTime = request.PreparationTime;
            product.ControlStock = request.ControlStock;
            product.StockSectorId = request.StockSectorId;
            product.MinStock = request.MinStock;
            product.MaxStock = request.MaxStock;
            product.StockContent = request.StockContent;
            product.IsDivisible = request.IsDivisible;
            product.IsPerishable = request.IsPerishable;
            product.IsAutoWeight = request.IsAutoWeight;

            // Update Prices (Using Clear/Add pattern to prevent ChangeTracker conflicts)
            product.Prices.Clear();
            foreach (var p in request.Prices)
            {
                var newPrice = new ProductPrice { Channel = p.Channel, Price = p.Price, IsVisible = p.IsVisible };
                product.Prices.Add(newPrice);
                _context.Entry(newPrice).State = EntityState.Added;
            }

            // Update Ingredients (Using Clear/Add pattern)
            product.Ingredients.Clear();
            foreach (var i in request.Ingredients)
            {
                var newComposition = new ProductComposition { IngredientProductId = i.IngredientProductId, Quantity = i.Quantity, Type = i.Type, AdditionalPrice = i.AdditionalPrice, IsActive = i.IsActive };
                product.Ingredients.Add(newComposition);
                _context.Entry(newComposition).State = EntityState.Added;
            }

            // Update ComboItems (Using Clear/Add pattern)
            product.ComboItems.Clear();
            foreach (var c in request.ComboItems)
            {
                var newCombo = new ProductCombo { ChildProductId = c.ChildProductId, Quantity = c.Quantity, FixedPrice = c.FixedPrice };
                product.ComboItems.Add(newCombo);
                _context.Entry(newCombo).State = EntityState.Added;
            }

            // Update Promotions
            product.Promotions.Clear();
            foreach (var promo in request.Promotions)
            {
                var newPromo = new ProductPromotion
                {
                    Id = promo.Id ?? Guid.NewGuid(),
                    DayStart = promo.DayStart,
                    HourStart = promo.HourStart,
                    DayEnd = promo.DayEnd,
                    HourEnd = promo.HourEnd,
                    Price = promo.Price,
                    IsSaleForbidden = promo.IsSaleForbidden
                };
                product.Promotions.Add(newPromo);
                _context.Entry(newPromo).State = EntityState.Added;
            }

            // Update Modifier Groups (Diff logic to prevent breaking foreign keys if used elsewhere)
            var existingGroups = product.ModifierGroups.ToList();
            var newGroupIds = request.ModifierGroups.Where(mg => mg.Id.HasValue).Select(mg => mg.Id.Value).ToList();

            // Remove deleted groups
            var groupsToRemove = existingGroups.Where(mg => !newGroupIds.Contains(mg.Id)).ToList();
            foreach (var group in groupsToRemove)
            {
                _context.ModifierOptions.RemoveRange(group.Options);
            }
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
                    existingGroup.IsPropType = reqMg.IsPropType;
                    existingGroup.CanBeFractioned = reqMg.CanBeFractioned;

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
                            existingOpt.BasePrice = reqOpt.BasePrice;
                            existingOpt.TotalPrice = reqOpt.TotalPrice;
                            existingOpt.MinQuantity = reqOpt.MinQuantity;
                            existingOpt.MaxQuantity = reqOpt.MaxQuantity;
                            existingOpt.Sequence = reqOpt.Sequence;
                            existingOpt.IsPreSelected = reqOpt.IsPreSelected;
                            existingOpt.IsVisible = reqOpt.IsVisible;
                            existingOpt.Abbreviation = reqOpt.Abbreviation;
                            existingOpt.ParentOptionId = reqOpt.ParentOptionId;
                        }
                        else
                        {
                            var newOption = new ModifierOption
                            {
                                Id = reqOpt.Id ?? Guid.NewGuid(),
                                Name = reqOpt.Name,
                                ProductId = reqOpt.ProductId,
                                AdditionalPrice = reqOpt.AdditionalPrice,
                                BasePrice = reqOpt.BasePrice,
                                TotalPrice = reqOpt.TotalPrice,
                                MinQuantity = reqOpt.MinQuantity,
                                MaxQuantity = reqOpt.MaxQuantity,
                                Sequence = reqOpt.Sequence,
                                IsPreSelected = reqOpt.IsPreSelected,
                                IsVisible = reqOpt.IsVisible,
                                Abbreviation = reqOpt.Abbreviation,
                                ParentOptionId = reqOpt.ParentOptionId
                            };
                            existingGroup.Options.Add(newOption);
                            _context.Entry(newOption).State = EntityState.Added;
                        }
                    }
                }
                else
                {
                    // Add new group
                    var newGroup = new ModifierGroup
                    {
                        Id = reqMg.Id ?? Guid.NewGuid(),
                        Name = reqMg.Name,
                        MinSelections = reqMg.MinSelections,
                        MaxSelections = reqMg.MaxSelections,
                        PriceRule = reqMg.PriceRule,
                        Sequence = reqMg.Sequence,
                        IsPropType = reqMg.IsPropType,
                        CanBeFractioned = reqMg.CanBeFractioned,
                        Options = reqMg.Options.Select(o => new ModifierOption
                        {
                            Id = o.Id ?? Guid.NewGuid(),
                            Name = o.Name,
                            ProductId = o.ProductId,
                            AdditionalPrice = o.AdditionalPrice,
                            BasePrice = o.BasePrice,
                            TotalPrice = o.TotalPrice,
                            MinQuantity = o.MinQuantity,
                            MaxQuantity = o.MaxQuantity,
                            Sequence = o.Sequence,
                            IsPreSelected = o.IsPreSelected,
                            IsVisible = o.IsVisible,
                            Abbreviation = o.Abbreviation,
                            ParentOptionId = o.ParentOptionId
                        }).ToList()
                    };
                    product.ModifierGroups.Add(newGroup);
                    _context.Entry(newGroup).State = EntityState.Added;
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

using NinoPDV.Api.DTOs;
using NinoPDV.Api.Models;
using NinoPDV.Api.Repositories;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace NinoPDV.Api.Services
{
    public class ProductService : IProductService
    {
        private readonly IProductRepository _productRepository;
        private readonly ICategoryRepository _categoryRepository;

        public ProductService(IProductRepository productRepository, ICategoryRepository categoryRepository)
        {
            _productRepository = productRepository;
            _categoryRepository = categoryRepository;
        }

        public async Task<IEnumerable<ProductResponseDTO>> GetProductsAsync()
        {
            var products = await _productRepository.GetAllWithCategoriesAsync();

            return products.Select(p => new ProductResponseDTO
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
                CategoryName = p.Category?.Name ?? "",
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
        }

        public async Task<ProductResponseDTO?> GetProductAsync(Guid id)
        {
            var product = await _productRepository.GetByIdWithDetailsAsync(id);

            if (product == null)
                return null;

            return new ProductResponseDTO
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
                CategoryName = product.Category?.Name ?? "",
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
                ModifierGroups = product.ModifierGroups.OrderBy(mg => mg.Sequence).Select(mg => new ModifierGroupDTO
                {
                    Id = mg.Id,
                    Name = mg.Name,
                    MinSelections = mg.MinSelections,
                    MaxSelections = mg.MaxSelections,
                    PriceRule = mg.PriceRule,
                    Sequence = mg.Sequence,
                    IsPropType = mg.IsPropType,
                    CanBeFractioned = mg.CanBeFractioned,
                    Options = mg.Options.OrderBy(o => o.Sequence).Select(o => new ModifierOptionDTO
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
        }

        public async Task<ProductResponseDTO> CreateProductAsync(ProductRequestDTO request)
        {
            var category = await _categoryRepository.GetByIdAsync(request.CategoryId);
            if (category == null)
                throw new ArgumentException("Categoria inválida.");

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
            
            product.ModifierGroups = request.ModifierGroups.Select((mg, mgIndex) => {
                var group = new ModifierGroup
                {
                    Id = mg.Id ?? Guid.NewGuid(),
                    Name = mg.Name,
                    MinSelections = mg.MinSelections,
                    MaxSelections = mg.MaxSelections,
                    PriceRule = mg.PriceRule,
                    Sequence = mgIndex,
                    IsPropType = mg.IsPropType,
                    CanBeFractioned = mg.CanBeFractioned
                };
                group.Options = mg.Options.Select((o, oIndex) => new ModifierOption
                {
                    Id = o.Id ?? Guid.NewGuid(),
                    ProductId = o.ProductId,
                    Name = o.Name,
                    AdditionalPrice = o.AdditionalPrice,
                    BasePrice = o.BasePrice,
                    TotalPrice = o.TotalPrice,
                    MinQuantity = o.MinQuantity,
                    MaxQuantity = o.MaxQuantity,
                    Sequence = oIndex,
                    IsPreSelected = o.IsPreSelected,
                    IsVisible = o.IsVisible,
                    Abbreviation = o.Abbreviation,
                    ParentOptionId = o.ParentOptionId
                }).ToList();
                return group;
            }).ToList();

            await _productRepository.AddAsync(product);

            return await GetProductAsync(product.Id) ?? throw new InvalidOperationException("Failed to retrieve created product.");
        }

        public async Task UpdateProductAsync(Guid id, ProductRequestDTO request)
        {
            var product = await _productRepository.GetByIdWithDetailsAsync(id);

            if (product == null)
                throw new KeyNotFoundException("Product not found");

            if (product.CategoryId != request.CategoryId)
            {
                var category = await _categoryRepository.GetByIdAsync(request.CategoryId);
                if (category == null) throw new ArgumentException("Categoria inválida.");
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

            product.Prices.Clear();
            foreach (var p in request.Prices)
                product.Prices.Add(new ProductPrice { Channel = p.Channel, Price = p.Price, IsVisible = p.IsVisible });

            product.Ingredients.Clear();
            foreach (var i in request.Ingredients)
                product.Ingredients.Add(new ProductComposition { IngredientProductId = i.IngredientProductId, Quantity = i.Quantity, Type = i.Type, AdditionalPrice = i.AdditionalPrice, IsActive = i.IsActive });

            product.ComboItems.Clear();
            foreach (var c in request.ComboItems)
                product.ComboItems.Add(new ProductCombo { ChildProductId = c.ChildProductId, Quantity = c.Quantity, FixedPrice = c.FixedPrice });

            product.Promotions.Clear();
            foreach (var promo in request.Promotions)
                product.Promotions.Add(new ProductPromotion
                {
                    Id = promo.Id ?? Guid.NewGuid(),
                    DayStart = promo.DayStart,
                    HourStart = promo.HourStart,
                    DayEnd = promo.DayEnd,
                    HourEnd = promo.HourEnd,
                    Price = promo.Price,
                    IsSaleForbidden = promo.IsSaleForbidden
                });

            var existingGroups = product.ModifierGroups.ToList();
            var newGroupIds = request.ModifierGroups.Where(mg => mg.Id.HasValue).Select(mg => mg.Id.Value).ToList();

            var groupsToRemove = existingGroups.Where(mg => !newGroupIds.Contains(mg.Id)).ToList();
            var optionsToRemove = groupsToRemove.SelectMany(g => g.Options).ToList();

            await _productRepository.RemoveModifierOptionsAsync(optionsToRemove);
            await _productRepository.RemoveModifierGroupsAsync(groupsToRemove);

            var groupIndex = 0;
            foreach (var reqMg in request.ModifierGroups)
            {
                if (reqMg.Id.HasValue && existingGroups.Any(mg => mg.Id == reqMg.Id))
                {
                    var existingGroup = existingGroups.First(mg => mg.Id == reqMg.Id);
                    existingGroup.Name = reqMg.Name;
                    existingGroup.MinSelections = reqMg.MinSelections;
                    existingGroup.MaxSelections = reqMg.MaxSelections;
                    existingGroup.PriceRule = reqMg.PriceRule;
                    existingGroup.Sequence = groupIndex;
                    existingGroup.IsPropType = reqMg.IsPropType;
                    existingGroup.CanBeFractioned = reqMg.CanBeFractioned;

                    var existingOptions = existingGroup.Options.ToList();
                    var newOptionIds = reqMg.Options.Where(o => o.Id.HasValue).Select(o => o.Id.Value).ToList();
                    
                    var optsToRemove = existingOptions.Where(o => !newOptionIds.Contains(o.Id)).ToList();
                    await _productRepository.RemoveModifierOptionsAsync(optsToRemove);
                    foreach (var o in optsToRemove) existingGroup.Options.Remove(o);

                    var optionIndex = 0;
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
                            existingOpt.Sequence = optionIndex;
                            existingOpt.IsPreSelected = reqOpt.IsPreSelected;
                            existingOpt.IsVisible = reqOpt.IsVisible;
                            existingOpt.Abbreviation = reqOpt.Abbreviation;
                            existingOpt.ParentOptionId = reqOpt.ParentOptionId;
                        }
                        else
                        {
                            existingGroup.Options.Add(new ModifierOption
                            {
                                Id = reqOpt.Id ?? Guid.NewGuid(),
                                Name = reqOpt.Name,
                                ProductId = reqOpt.ProductId,
                                AdditionalPrice = reqOpt.AdditionalPrice,
                                BasePrice = reqOpt.BasePrice,
                                TotalPrice = reqOpt.TotalPrice,
                                MinQuantity = reqOpt.MinQuantity,
                                MaxQuantity = reqOpt.MaxQuantity,
                                Sequence = optionIndex,
                                IsPreSelected = reqOpt.IsPreSelected,
                                IsVisible = reqOpt.IsVisible,
                                Abbreviation = reqOpt.Abbreviation,
                                ParentOptionId = reqOpt.ParentOptionId
                            });
                        }
                        optionIndex++;
                    }
                }
                else
                {
                    product.ModifierGroups.Add(new ModifierGroup
                    {
                        Id = reqMg.Id ?? Guid.NewGuid(),
                        Name = reqMg.Name,
                        MinSelections = reqMg.MinSelections,
                        MaxSelections = reqMg.MaxSelections,
                        PriceRule = reqMg.PriceRule,
                        Sequence = groupIndex,
                        IsPropType = reqMg.IsPropType,
                        CanBeFractioned = reqMg.CanBeFractioned,
                        Options = reqMg.Options.Select((o, oIndex) => new ModifierOption
                        {
                            Id = o.Id ?? Guid.NewGuid(),
                            Name = o.Name,
                            ProductId = o.ProductId,
                            AdditionalPrice = o.AdditionalPrice,
                            BasePrice = o.BasePrice,
                            TotalPrice = o.TotalPrice,
                            MinQuantity = o.MinQuantity,
                            MaxQuantity = o.MaxQuantity,
                            Sequence = oIndex,
                            IsPreSelected = o.IsPreSelected,
                            IsVisible = o.IsVisible,
                            Abbreviation = o.Abbreviation,
                            ParentOptionId = o.ParentOptionId
                        }).ToList()
                    });
                }
                groupIndex++;
            }

            await _productRepository.UpdateAsync(product);
        }

        public async Task DeleteProductAsync(Guid id)
        {
            var product = await _productRepository.GetByIdAsync(id);
            if (product == null)
                throw new KeyNotFoundException("Product not found");

            try
            {
                await _productRepository.DeleteAsync(product);
            }
            catch (Exception ex)
            {
                throw new InvalidOperationException("Não é possível excluir este produto, pois ele está associado a outras tabelas.", ex);
            }
        }
    }
}

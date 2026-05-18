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
    [Authorize] // Requer token JWT válido
    public class CategoriesController : ControllerBase
    {
        private readonly AppDbContext _context;

        public CategoriesController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/categories
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Category>>> GetCategories()
        {
            var categories = await _context.Categories
                .OrderBy(c => c.Sequence)
                .ToListAsync();

            return Ok(categories);
        }

        // POST: api/categories
        [HttpPost]
        public async Task<ActionResult<Category>> CreateCategory(CategoryRequest request)
        {
            if (string.IsNullOrWhiteSpace(request.Name))
            {
                return BadRequest("O nome da categoria é obrigatório.");
            }

            var trimmedName = request.Name.Trim();
            if (trimmedName.Length < 2 || trimmedName.Length > 50)
            {
                return BadRequest("O nome da categoria deve ter entre 2 e 50 caracteres.");
            }

            if (request.Description != null && request.Description.Length > 200)
            {
                return BadRequest("A descrição da categoria não pode ultrapassar 200 caracteres.");
            }

            var nameLower = trimmedName.ToLower();
            var exists = await _context.Categories.AnyAsync(c => c.Name.ToLower() == nameLower);
            if (exists)
            {
                return BadRequest("Já existe uma categoria com este nome.");
            }

            // Calcula o maior Sequence existente para colocar no final
            var maxSeq = await _context.Categories.AnyAsync()
                ? await _context.Categories.MaxAsync(c => c.Sequence)
                : -1;

            if (request.ParentCategoryId.HasValue)
            {
                var parentExists = await _context.Categories.AnyAsync(c => c.Id == request.ParentCategoryId.Value);
                if (!parentExists)
                {
                    return BadRequest("A categoria principal informada não existe.");
                }
            }

            var category = new Category
            {
                Name = trimmedName,
                Description = request.Description?.Trim(),
                Sequence = maxSeq + 1,
                ParentCategoryId = request.ParentCategoryId,
                ImageBase64 = request.ImageBase64
            };

            _context.Categories.Add(category);
            await _context.SaveChangesAsync();

            return Ok(category);
        }

        // PUT: api/categories/{id}
        [HttpPut("{id}")]
        public async Task<ActionResult<Category>> UpdateCategory(Guid id, CategoryRequest request)
        {
            if (string.IsNullOrWhiteSpace(request.Name))
            {
                return BadRequest("O nome da categoria é obrigatório.");
            }

            var trimmedName = request.Name.Trim();
            if (trimmedName.Length < 2 || trimmedName.Length > 50)
            {
                return BadRequest("O nome da categoria deve ter entre 2 e 50 caracteres.");
            }

            if (request.Description != null && request.Description.Length > 200)
            {
                return BadRequest("A descrição da categoria não pode ultrapassar 200 caracteres.");
            }

            var category = await _context.Categories.FindAsync(id);
            if (category == null)
            {
                return NotFound("Categoria não encontrada.");
            }

            var nameLower = trimmedName.ToLower();
            var exists = await _context.Categories
                .AnyAsync(c => c.Id != id && c.Name.ToLower() == nameLower);
            if (exists)
            {
                return BadRequest("Já existe outra categoria com este nome.");
            }

            if (request.ParentCategoryId.HasValue)
            {
                if (request.ParentCategoryId.Value == id)
                {
                    return BadRequest("Uma categoria não pode ser subcategoria dela mesma.");
                }

                var parentExists = await _context.Categories.AnyAsync(c => c.Id == request.ParentCategoryId.Value);
                if (!parentExists)
                {
                    return BadRequest("A categoria principal informada não existe.");
                }
            }

            category.Name = trimmedName;
            category.Description = request.Description?.Trim();
            category.ParentCategoryId = request.ParentCategoryId;
            
            // Só altera a imagem se o request explicitamente enviar um valor (null limpa, texto altera)
            // Se o campo estiver presente na modelagem UI
            category.ImageBase64 = request.ImageBase64;
            
            category.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();

            return Ok(category);
        }

        // DELETE: api/categories/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteCategory(Guid id)
        {
            var category = await _context.Categories.FindAsync(id);
            if (category == null)
            {
                return NotFound("Categoria não encontrada.");
            }

            // Trava de Segurança: Não permite excluir se houver produtos atrelados
            var hasProducts = await _context.Products.AnyAsync(p => p.CategoryId == id);
            if (hasProducts)
            {
                return BadRequest("Não é possível excluir esta categoria pois ela possui produtos associados.");
            }

            _context.Categories.Remove(category);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        // PUT: api/categories/reorder
        [HttpPut("reorder")]
        public async Task<IActionResult> ReorderCategories(ReorderCategoriesRequest request)
        {
            if (request.OrderedIds == null || request.OrderedIds.Count == 0)
            {
                return BadRequest("Lista de IDs de ordenação inválida.");
            }

            // Atualiza sequencialmente cada categoria no banco
            for (int i = 0; i < request.OrderedIds.Count; i++)
            {
                var id = request.OrderedIds[i];
                var category = await _context.Categories.FindAsync(id);
                if (category != null)
                {
                    category.Sequence = i;
                    category.UpdatedAt = DateTime.UtcNow;
                }
            }

            await _context.SaveChangesAsync();

            return Ok();
        }
    }
}

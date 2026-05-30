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
    public class StockSectorsController : ControllerBase
    {
        private readonly AppDbContext _context;

        public StockSectorsController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/stocksectors
        [HttpGet]
        public async Task<ActionResult<IEnumerable<StockSector>>> GetStockSectors()
        {
            var sectors = await _context.StockSectors
                .OrderBy(s => s.Name)
                .ToListAsync();

            return Ok(sectors);
        }

        // POST: api/stocksectors
        [HttpPost]
        public async Task<ActionResult<StockSector>> CreateStockSector(StockSectorDTO request)
        {
            if (string.IsNullOrWhiteSpace(request.Name))
            {
                return BadRequest("O nome do setor de estoque é obrigatório.");
            }

            var trimmedName = request.Name.Trim();
            if (trimmedName.Length < 2 || trimmedName.Length > 50)
            {
                return BadRequest("O nome do setor deve ter entre 2 e 50 caracteres.");
            }

            if (request.Description != null && request.Description.Length > 200)
            {
                return BadRequest("A descrição do setor não pode ultrapassar 200 caracteres.");
            }

            var nameLower = trimmedName.ToLower();
            var exists = await _context.StockSectors.AnyAsync(s => s.Name.ToLower() == nameLower);
            if (exists)
            {
                return BadRequest("Já existe um setor de estoque com este nome.");
            }

            var sector = new StockSector
            {
                Name = trimmedName,
                Description = request.Description?.Trim()
            };

            _context.StockSectors.Add(sector);
            await _context.SaveChangesAsync();

            return Ok(sector);
        }

        // PUT: api/stocksectors/{id}
        [HttpPut("{id}")]
        public async Task<ActionResult<StockSector>> UpdateStockSector(Guid id, StockSectorDTO request)
        {
            if (string.IsNullOrWhiteSpace(request.Name))
            {
                return BadRequest("O nome do setor de estoque é obrigatório.");
            }

            var trimmedName = request.Name.Trim();
            if (trimmedName.Length < 2 || trimmedName.Length > 50)
            {
                return BadRequest("O nome do setor deve ter entre 2 e 50 caracteres.");
            }

            if (request.Description != null && request.Description.Length > 200)
            {
                return BadRequest("A descrição do setor não pode ultrapassar 200 caracteres.");
            }

            var sector = await _context.StockSectors.FindAsync(id);
            if (sector == null)
            {
                return NotFound("Setor de estoque não encontrado.");
            }

            var nameLower = trimmedName.ToLower();
            var exists = await _context.StockSectors
                .AnyAsync(s => s.Id != id && s.Name.ToLower() == nameLower);
            if (exists)
            {
                return BadRequest("Já existe outro setor de estoque com este nome.");
            }

            sector.Name = trimmedName;
            sector.Description = request.Description?.Trim();
            sector.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();

            return Ok(sector);
        }

        // DELETE: api/stocksectors/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteStockSector(Guid id)
        {
            var sector = await _context.StockSectors.FindAsync(id);
            if (sector == null)
            {
                return NotFound("Setor de estoque não encontrado.");
            }

            // Verifica se existem produtos atrelados a este setor
            var hasProducts = await _context.Products.AnyAsync(p => p.StockSectorId == id);
            if (hasProducts)
            {
                return BadRequest("Não é possível excluir este setor pois existem produtos associados a ele.");
            }

            _context.StockSectors.Remove(sector);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}

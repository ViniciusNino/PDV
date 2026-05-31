using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using NinoPDV.Api.DTOs;
using NinoPDV.Api.Models;
using NinoPDV.Api.Services;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace NinoPDV.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class StockSectorsController : ControllerBase
    {
        private readonly IStockSectorService _stockSectorService;

        public StockSectorsController(IStockSectorService stockSectorService)
        {
            _stockSectorService = stockSectorService;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<StockSector>>> GetStockSectors()
        {
            var sectors = await _stockSectorService.GetStockSectorsAsync();
            return Ok(sectors);
        }

        [HttpPost]
        public async Task<ActionResult<StockSector>> CreateStockSector(StockSectorDTO request)
        {
            try
            {
                var sector = await _stockSectorService.CreateStockSectorAsync(request);
                return Ok(sector);
            }
            catch (ArgumentException ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPut("{id}")]
        public async Task<ActionResult<StockSector>> UpdateStockSector(Guid id, StockSectorDTO request)
        {
            try
            {
                var sector = await _stockSectorService.UpdateStockSectorAsync(id, request);
                return Ok(sector);
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(ex.Message);
            }
            catch (ArgumentException ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteStockSector(Guid id)
        {
            try
            {
                await _stockSectorService.DeleteStockSectorAsync(id);
                return NoContent();
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(ex.Message);
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(ex.Message);
            }
        }
    }
}

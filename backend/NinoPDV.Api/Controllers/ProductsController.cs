using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using NinoPDV.Api.DTOs;
using NinoPDV.Api.Services;

namespace NinoPDV.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class ProductsController : ControllerBase
{
    private readonly IProductService _productService;

    public ProductsController(IProductService productService)
    {
        _productService = productService;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<ProductResponseDTO>>> GetProducts()
    {
        var dtos = await _productService.GetProductsAsync();
        return Ok(dtos);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<ProductResponseDTO>> GetProduct(Guid id)
    {
        var dto = await _productService.GetProductAsync(id);

        if (dto == null)
        {
            return NotFound();
        }

        return Ok(dto);
    }

    [HttpPost]
    public async Task<ActionResult<ProductResponseDTO>> CreateProduct(ProductRequestDTO request)
    {
        try
        {
            var dto = await _productService.CreateProductAsync(request);
            return CreatedAtAction(nameof(GetProduct), new { id = dto.Id }, dto);
        }
        catch (ArgumentException ex)
        {
            return BadRequest(ex.Message);
        }
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateProduct(Guid id, ProductRequestDTO request)
    {
        try
        {
            await _productService.UpdateProductAsync(id, request);
            return NoContent();
        }
        catch (KeyNotFoundException)
        {
            return NotFound();
        }
        catch (ArgumentException ex)
        {
            return BadRequest(ex.Message);
        }
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteProduct(Guid id)
    {
        try
        {
            await _productService.DeleteProductAsync(id);
            return NoContent();
        }
        catch (KeyNotFoundException)
        {
            return NotFound();
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(ex.Message);
        }
    }
}

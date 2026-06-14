using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using NinoPDV.Api.Models;
using NinoPDV.Api.Repositories;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace NinoPDV.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class SuppliersController : ControllerBase
    {
        private readonly IRepository<Supplier> _repository;

        public SuppliersController(IRepository<Supplier> repository)
        {
            _repository = repository;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Supplier>>> GetSuppliers()
        {
            var suppliers = await _repository.GetAllAsync();
            return Ok(suppliers);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Supplier>> GetSupplier(Guid id)
        {
            var supplier = await _repository.GetByIdAsync(id);
            if (supplier == null)
            {
                return NotFound($"Fornecedor com ID {id} não encontrado.");
            }
            return Ok(supplier);
        }

        [HttpPost]
        public async Task<ActionResult<Supplier>> CreateSupplier(Supplier supplier)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            // Garante que um novo ID Guid seja gerado caso não venha no request
            if (supplier.Id == Guid.Empty)
            {
                supplier.Id = Guid.NewGuid();
            }

            // Registra metadados iniciais
            supplier.CreatedAt = DateTime.UtcNow;
            supplier.UpdatedAt = DateTime.UtcNow;
            supplier.IsSynced = false;
            supplier.Version = 1;

            var created = await _repository.AddAsync(supplier);
            return CreatedAtAction(nameof(GetSupplier), new { id = created.Id }, created);
        }

        [HttpPut("{id}")]
        public async Task<ActionResult<Supplier>> UpdateSupplier(Guid id, Supplier supplierUpdates)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var existing = await _repository.GetByIdAsync(id);
            if (existing == null)
            {
                return NotFound($"Fornecedor com ID {id} não encontrado.");
            }

            // Atualiza propriedades básicas
            existing.TradingName = supplierUpdates.TradingName;
            existing.CompanyName = supplierUpdates.CompanyName;
            existing.Phone = supplierUpdates.Phone;
            existing.LogoUrl = supplierUpdates.LogoUrl;
            
            // Documentos
            existing.Cnpj = supplierUpdates.Cnpj;
            existing.StateRegistration = supplierUpdates.StateRegistration;
            existing.MunicipalRegistration = supplierUpdates.MunicipalRegistration;
            existing.FoundationDate = supplierUpdates.FoundationDate;

            // Contato
            existing.Email = supplierUpdates.Email;
            existing.Cellphone = supplierUpdates.Cellphone;
            existing.Slogan = supplierUpdates.Slogan;

            // Social
            existing.Facebook = supplierUpdates.Facebook;
            existing.Twitter = supplierUpdates.Twitter;
            existing.Linkedin = supplierUpdates.Linkedin;

            // Outros
            existing.PurchaseLimit = supplierUpdates.PurchaseLimit;
            existing.Shareholder = supplierUpdates.Shareholder;

            // Endereço
            existing.Cep = supplierUpdates.Cep;
            existing.State = supplierUpdates.State;
            existing.City = supplierUpdates.City;
            existing.Neighborhood = supplierUpdates.Neighborhood;
            existing.LocationType = supplierUpdates.LocationType;
            existing.Street = supplierUpdates.Street;
            existing.Number = supplierUpdates.Number;
            existing.Complement = supplierUpdates.Complement;
            existing.ReferencePoint = supplierUpdates.ReferencePoint;
            existing.Building = supplierUpdates.Building;
            existing.ApartmentNumber = supplierUpdates.ApartmentNumber;
            existing.Block = supplierUpdates.Block;
            existing.Floor = supplierUpdates.Floor;

            // Login e Senha
            existing.Login = supplierUpdates.Login;
            existing.Password = supplierUpdates.Password;

            // BaseEntity properties são tratadas automaticamente no SaveChanges do AppDbContext

            await _repository.UpdateAsync(existing);
            return Ok(existing);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteSupplier(Guid id)
        {
            var existing = await _repository.GetByIdAsync(id);
            if (existing == null)
            {
                return NotFound($"Fornecedor com ID {id} não encontrado.");
            }

            await _repository.DeleteAsync(existing);
            return NoContent();
        }
    }
}

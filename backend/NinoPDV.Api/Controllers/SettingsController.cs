using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using NinoPDV.Api.DTOs;
using NinoPDV.Api.Services;
using System;
using System.Threading.Tasks;

namespace NinoPDV.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class SettingsController : ControllerBase
{
    private readonly ISettingsService _settingsService;

    public SettingsController(ISettingsService settingsService)
    {
        _settingsService = settingsService;
    }

    [HttpGet("check")]
    public async Task<ActionResult<bool>> CheckSettings()
    {
        var hasCompany = await _settingsService.CheckSettingsAsync();
        return Ok(hasCompany);
    }

    [HttpGet]
    public async Task<ActionResult<SettingsPayload>> GetSettings()
    {
        var settings = await _settingsService.GetSettingsAsync();
        return Ok(settings);
    }

    [HttpPost]
    public async Task<ActionResult> SaveSettings(SettingsPayload payload)
    {
        try
        {
            await _settingsService.SaveSettingsAsync(payload);
            return Ok(new { Message = "Configurações salvas com sucesso!" });
        }
        catch (Exception ex)
        {
            return BadRequest(new { Message = "Erro ao salvar configurações.", Error = ex.Message });
        }
    }
}

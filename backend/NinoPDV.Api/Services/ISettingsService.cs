using NinoPDV.Api.DTOs;
using System.Threading.Tasks;

namespace NinoPDV.Api.Services
{
    public interface ISettingsService
    {
        Task<bool> CheckSettingsAsync();
        Task<SettingsPayload> GetSettingsAsync();
        Task SaveSettingsAsync(SettingsPayload payload);
    }
}

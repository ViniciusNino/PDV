using Microsoft.EntityFrameworkCore;
using NinoPDV.Api.Data;
using NinoPDV.Api.Models;
using BC = BCrypt.Net.BCrypt;

namespace NinoPDV.Api.Utils;

public static class DataSeeder
{
    public static async Task SeedUsers(AppDbContext context)
    {
        // Ensure the database is created and migrations are applied
        await context.Database.MigrateAsync();

        if (!await context.Users.AnyAsync(u => u.Username == "Admin"))
        {
            var adminUser = new User
            {
                Name = "Administrador",
                Username = "Admin",
                PasswordHash = BC.HashPassword("123456"),
                Role = "Admin",
                IsActive = true
            };

            context.Users.Add(adminUser);
            await context.SaveChangesAsync();
        }
    }
}

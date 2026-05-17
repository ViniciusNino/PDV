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

        var adminUser = await context.Users.FirstOrDefaultAsync(u => u.Username == "Admin");
        if (adminUser == null)
        {
            adminUser = new User
            {
                Name = "Administrador",
                Username = "Admin",
                PasswordHash = BC.HashPassword("123"),
                Role = "Admin",
                IsActive = true
            };

            context.Users.Add(adminUser);
            await context.SaveChangesAsync();
        }
        else
        {
            // Garante que a senha seja "123" mesmo se o banco já tiver sido seedado com "123456"
            if (!BC.Verify("123", adminUser.PasswordHash))
            {
                adminUser.PasswordHash = BC.HashPassword("123");
                context.Users.Update(adminUser);
                await context.SaveChangesAsync();
            }
        }
    }
}

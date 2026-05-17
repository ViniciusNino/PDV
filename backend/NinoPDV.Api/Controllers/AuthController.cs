using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using NinoPDV.Api.Data;
using NinoPDV.Api.DTOs;
using NinoPDV.Api.Models;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using BC = BCrypt.Net.BCrypt;

namespace NinoPDV.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly AppDbContext _context;
    private readonly IConfiguration _config;

    public AuthController(AppDbContext context, IConfiguration config)
    {
        _context = context;
        _config = config;
    }

    [HttpPost("login")]
    public async Task<ActionResult<LoginResponse>> Login(LoginRequest request)
    {
        var user = await _context.Users
            .FirstOrDefaultAsync(u => u.Username.ToLower() == request.Username.ToLower());

        if (user == null || !BC.Verify(request.Password, user.PasswordHash))
        {
            return Unauthorized("Usuário ou senha inválidos.");
        }

        if (!user.IsActive)
        {
            return BadRequest("Usuário inativo.");
        }

        var token = GenerateJwtToken(user);

        return Ok(new LoginResponse(
            Token: token,
            Username: user.Username,
            Name: user.Name,
            Role: user.Role,
            CloudAccountId: user.CloudAccountId
        ));
    }

    [HttpGet("users")]
    public async Task<ActionResult<IEnumerable<UserListResponse>>> GetUsers()
    {
        var users = await _context.Users
            .Where(u => u.IsActive)
            .Select(u => new UserListResponse(u.Name, u.Username, u.Role))
            .ToListAsync();

        return Ok(users);
    }

    [HttpPost("register")]
    public async Task<ActionResult<User>> Register(RegisterRequest request)
    {
        if (await _context.Users.AnyAsync(u => u.Username.ToLower() == request.Username.ToLower()))
        {
            return BadRequest("Este nome de usuário já está em uso.");
        }

        var user = new User
        {
            Name = request.Name,
            Username = request.Username,
            PasswordHash = BC.HashPassword(request.Password),
            Role = request.Role
        };

        _context.Users.Add(user);
        await _context.SaveChangesAsync();

        return Ok(user);
    }

    [HttpPost("oauth")]
    public async Task<ActionResult<LoginResponse>> OAuthLogin(OAuthLoginRequest request)
    {
        // 1. Procurar o usuário pelo ProviderId e Provider
        var user = await _context.Users
            .FirstOrDefaultAsync(u => u.OAuthProvider == request.Provider && u.ProviderId == request.ProviderId);

        // 2. Se não existir, criar um novo usuário com esses dados
        if (user == null)
        {
            // Criar username base no e-mail ou gerado
            var username = string.IsNullOrEmpty(request.Email) 
                ? $"{request.Provider.ToLower()}_{request.ProviderId}" 
                : request.Email;

            // Garantir que username seja único
            if (await _context.Users.AnyAsync(u => u.Username.ToLower() == username.ToLower()))
            {
                username = $"{username}_{Guid.NewGuid().ToString().Substring(0, 4)}";
            }

            user = new User
            {
                Name = request.Name,
                Username = username,
                PasswordHash = BC.HashPassword(Guid.NewGuid().ToString()), // Senha aleatória, pois o login é social
                Role = "Admin", // Papel padrão, num sistema real poderia ser diferente
                OAuthProvider = request.Provider,
                ProviderId = request.ProviderId,
                IsActive = true
            };

            _context.Users.Add(user);
            await _context.SaveChangesAsync();
        }

        if (!user.IsActive)
        {
            return BadRequest("Usuário inativo.");
        }

        // 3. Gerar o Token JWT
        var token = GenerateJwtToken(user);

        return Ok(new LoginResponse(
            Token: token,
            Username: user.Username,
            Name: user.Name,
            Role: user.Role,
            CloudAccountId: user.CloudAccountId
        ));
    }

    private string GenerateJwtToken(User user)
    {
        var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["Jwt:Key"] ?? throw new InvalidOperationException("JWT Key not found")));
        var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);

        var claims = new[]
        {
            new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
            new Claim(ClaimTypes.Name, user.Username),
            new Claim(ClaimTypes.Role, user.Role),
            new Claim("CloudAccountId", user.CloudAccountId ?? "")
        };

        var token = new JwtSecurityToken(
            issuer: _config["Jwt:Issuer"],
            audience: _config["Jwt:Audience"],
            claims: claims,
            expires: DateTime.Now.AddDays(7),
            signingCredentials: credentials);

        return new JwtSecurityTokenHandler().WriteToken(token);
    }
}

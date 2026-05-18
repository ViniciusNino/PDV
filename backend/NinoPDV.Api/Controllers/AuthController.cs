using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using NinoPDV.Api.Data;
using NinoPDV.Api.DTOs;
using NinoPDV.Api.Models;
using NinoPDV.Api.Services;
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
    private readonly IEmailService _emailService;

    public AuthController(AppDbContext context, IConfiguration config, IEmailService emailService)
    {
        _context = context;
        _config = config;
        _emailService = emailService;
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

    [HttpPost("register-cloud")]
    public async Task<ActionResult> RegisterCloud(RegisterCloudRequest request)
    {
        // 1. Validar e-mail único
        if (await _context.Users.AnyAsync(u => u.Email != null && u.Email.ToLower() == request.Email.ToLower()))
        {
            return BadRequest("Este endereço de e-mail já está associado a uma conta.");
        }

        // 2. Validar username único (utilizando e-mail como username base)
        var username = request.Email;
        if (await _context.Users.AnyAsync(u => u.Username.ToLower() == username.ToLower()))
        {
            username = $"{username}_{Guid.NewGuid().ToString().Substring(0, 4)}";
        }

        // 3. Gerar código de 6 dígitos
        var random = new Random();
        var code = random.Next(100000, 999999).ToString();

        // 4. Criar o usuário inativo
        var user = new User
        {
            Name = request.Name,
            Username = username,
            Email = request.Email,
            Phone = request.Phone,
            Gender = request.Gender,
            PasswordHash = BC.HashPassword(request.Password),
            Role = "Admin", // Por padrão é Admin
            IsActive = false, // Só fica ativo pós confirmação de e-mail
            IsEmailVerified = false,
            EmailVerificationCode = code,
            EmailVerificationCodeExpires = DateTime.UtcNow.AddMinutes(10)
        };

        _context.Users.Add(user);
        await _context.SaveChangesAsync();

        // 5. Enviar e-mail com o código
        await _emailService.SendVerificationCodeAsync(request.Email, code);

        return Ok(new { Message = "Código de verificação enviado para o e-mail cadastrado." });
    }

    [HttpPost("verify-email")]
    public async Task<ActionResult<LoginResponse>> VerifyEmail(VerifyEmailRequest request)
    {
        var user = await _context.Users
            .FirstOrDefaultAsync(u => u.Email != null && u.Email.ToLower() == request.Email.ToLower());

        if (user == null)
        {
            return NotFound("Usuário não encontrado.");
        }

        if (user.IsEmailVerified)
        {
            return BadRequest("Este e-mail já foi verificado anteriormente.");
        }

        if (user.EmailVerificationCode != request.Code)
        {
            return BadRequest("Código de verificação incorreto.");
        }

        if (user.EmailVerificationCodeExpires < DateTime.UtcNow)
        {
            return BadRequest("O código de verificação expirou. Por favor, solicite um novo código.");
        }

        // Ativa e valida o usuário
        user.IsActive = true;
        user.IsEmailVerified = true;
        user.EmailVerificationCode = null;
        user.EmailVerificationCodeExpires = null;

        await _context.SaveChangesAsync();

        // Gera o token JWT para o login automático
        var token = GenerateJwtToken(user);

        return Ok(new LoginResponse(
            Token: token,
            Username: user.Username,
            Name: user.Name,
            Role: user.Role,
            CloudAccountId: user.CloudAccountId
        ));
    }

    [HttpPost("resend-code")]
    public async Task<ActionResult> ResendCode(ResendCodeRequest request)
    {
        var user = await _context.Users
            .FirstOrDefaultAsync(u => u.Email != null && u.Email.ToLower() == request.Email.ToLower());

        if (user == null)
        {
            return NotFound("Usuário não encontrado.");
        }

        if (user.IsEmailVerified)
        {
            return BadRequest("Este e-mail já está verificado.");
        }

        // Gera novo código
        var random = new Random();
        var code = random.Next(100000, 999999).ToString();

        user.EmailVerificationCode = code;
        user.EmailVerificationCodeExpires = DateTime.UtcNow.AddMinutes(10);

        await _context.SaveChangesAsync();

        // Envia o novo código
        await _emailService.SendVerificationCodeAsync(request.Email, code);

        return Ok(new { Message = "Novo código de verificação enviado para o e-mail." });
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

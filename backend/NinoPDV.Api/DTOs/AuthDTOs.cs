namespace NinoPDV.Api.DTOs;

public record LoginRequest(string Username, string Password);

public record LoginResponse(
    string Token, 
    string Username, 
    string Name, 
    string Role,
    string? CloudAccountId
);

public record RegisterRequest(
    string Name, 
    string Username, 
    string Password, 
    string Role = "Admin"
);

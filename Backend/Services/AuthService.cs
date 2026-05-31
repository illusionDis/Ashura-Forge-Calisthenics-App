using AshuraForge.API.Data;
using AshuraForge.API.DTOs;
using AshuraForge.API.Models;
using Microsoft.EntityFrameworkCore;

namespace AshuraForge.API.Services;

public interface IAuthService
{
    Task<AuthResponseDto> RegisterAsync(RegisterDto dto);
    Task<AuthResponseDto> LoginAsync(LoginDto dto);
}

public class AuthService : IAuthService
{
    private readonly AppDbContext _db;
    private readonly ITokenService _tokenService;

    public AuthService(AppDbContext db, ITokenService tokenService)
    {
        _db = db;
        _tokenService = tokenService;
    }

    // ── GEREKSİNİM 1: Kayıt ol/POST ──────────────────────────────────────────
    public async Task<AuthResponseDto> RegisterAsync(RegisterDto dto)
    {
        // Email ve username tekrar kontrolü
        if (await _db.Users.AnyAsync(u => u.Email == dto.Email.ToLower()))
            throw new InvalidOperationException("Bu email adresi zaten kayıtlı.");

        if (await _db.Users.AnyAsync(u => u.Username == dto.Username))
            throw new InvalidOperationException("Bu kullanıcı adı zaten alınmış.");

        var user = new User
        {
            Username = dto.Username,
            Email = dto.Email.ToLower(),
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password),
            Title = "Acemi Savaşçı",
            CreatedAt = DateTime.UtcNow
        };

        _db.Users.Add(user);
        await _db.SaveChangesAsync();

        // Kayıt hoş geldin bildirimi
        _db.Notifications.Add(new Notification
        {
            UserId = user.Id,
            Message = $"Hoş geldin {user.Username}! Ashura Forge'a katıldın. İlk antrenmanını ekle! 💪",
            Type = "system"
        });

        // İlk progress kaydı oluştur
        _db.UserProgresses.Add(new UserProgress
        {
            UserId = user.Id,
            CurrentTitle = user.Title
        });

        await _db.SaveChangesAsync();

        var token = _tokenService.GenerateToken(user);

        return new AuthResponseDto
        {
            Token = token,
            Username = user.Username,
            Email = user.Email,
            Title = user.Title,
            ProfileImageUrl = user.ProfileImageUrl,
            ExpiresAt = DateTime.UtcNow.AddDays(1)
        };
    }

    // ── GEREKSİNİM 2: Giriş yap/POST ─────────────────────────────────────────
    public async Task<AuthResponseDto> LoginAsync(LoginDto dto)
    {
        var user = await _db.Users
            .FirstOrDefaultAsync(u => u.Email == dto.Email.ToLower())
            ?? throw new UnauthorizedAccessException("Email veya şifre hatalı.");

        if (!BCrypt.Net.BCrypt.Verify(dto.Password, user.PasswordHash))
            throw new UnauthorizedAccessException("Email veya şifre hatalı.");

        var token = _tokenService.GenerateToken(user);

        return new AuthResponseDto
        {
            Token = token,
            Username = user.Username,
            Email = user.Email,
            Title = user.Title,
            ProfileImageUrl = user.ProfileImageUrl,
            ExpiresAt = DateTime.UtcNow.AddDays(1)
        };
    }
}

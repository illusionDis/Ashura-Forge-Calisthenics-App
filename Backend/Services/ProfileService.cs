using AshuraForge.API.Data;
using AshuraForge.API.DTOs;
using AshuraForge.API.Models;
using Microsoft.EntityFrameworkCore;

namespace AshuraForge.API.Services;
// ─────────────────────────────────────────────────────────────────────────────
// GEREKSİNİM 7-8: Profil fotoğrafı değiştir/PUT + Profil düzenle/PATCH
// ─────────────────────────────────────────────────────────────────────────────
public interface IProfileService
{
    Task<ProfileResponseDto> GetProfileAsync(int userId);
    Task<ProfileResponseDto> UpdateProfileAsync(int userId, UpdateProfileDto dto);
    Task<ProfileResponseDto> UpdateProfileImageAsync(int userId, UpdateProfileImageDto dto);
}

public class ProfileService : IProfileService
{
    private readonly AppDbContext _db;

    public ProfileService(AppDbContext db)
    {
        _db = db;
    }

    public async Task<ProfileResponseDto> GetProfileAsync(int userId)
    {
        var user = await _db.Users
            .Include(u => u.UserBadges)
            .FirstOrDefaultAsync(u => u.Id == userId)
            ?? throw new KeyNotFoundException("Kullanıcı bulunamadı.");

        return MapToDto(user);
    }

    // GEREKSİNİM 7: Profil fotoğrafı değiştir/PUT
    public async Task<ProfileResponseDto> UpdateProfileImageAsync(int userId, UpdateProfileImageDto dto)
    {
        var user = await _db.Users.FindAsync(userId)
            ?? throw new KeyNotFoundException("Kullanıcı bulunamadı.");

        user.ProfileImageUrl = dto.ProfileImageUrl;
        await _db.SaveChangesAsync();

        return await GetProfileAsync(userId);
    }

    // GEREKSİNİM 8: Profil düzenle/PUT/PATCH
    public async Task<ProfileResponseDto> UpdateProfileAsync(int userId, UpdateProfileDto dto)
    {
        var user = await _db.Users.FindAsync(userId)
            ?? throw new KeyNotFoundException("Kullanıcı bulunamadı.");

        if (!string.IsNullOrWhiteSpace(dto.Username))
        {
            var exists = await _db.Users.AnyAsync(
                u => u.Username == dto.Username && u.Id != userId);
            if (exists)
                throw new InvalidOperationException("Bu kullanıcı adı zaten alınmış.");
            user.Username = dto.Username;
        }

        if (!string.IsNullOrWhiteSpace(dto.Email))
        {
            var exists = await _db.Users.AnyAsync(
                u => u.Email == dto.Email.ToLower() && u.Id != userId);
            if (exists)
                throw new InvalidOperationException("Bu email adresi zaten kayıtlı.");
            user.Email = dto.Email.ToLower();
        }

        if (!string.IsNullOrWhiteSpace(dto.NewPassword))
        {
            if (string.IsNullOrWhiteSpace(dto.CurrentPassword))
                throw new InvalidOperationException("Mevcut şifreyi girmelisiniz.");

            if (!BCrypt.Net.BCrypt.Verify(dto.CurrentPassword, user.PasswordHash))
                throw new UnauthorizedAccessException("Mevcut şifre hatalı.");

            user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.NewPassword);
        }

        await _db.SaveChangesAsync();
        return await GetProfileAsync(userId);
    }

    private static ProfileResponseDto MapToDto(User user) => new()
    {
        Id = user.Id,
        Username = user.Username,
        Email = user.Email,
        ProfileImageUrl = user.ProfileImageUrl,
        Title = user.Title,
        TotalWorkouts = user.TotalWorkouts,
        BadgeCount = user.UserBadges.Count,
        CreatedAt = user.CreatedAt
    };
}
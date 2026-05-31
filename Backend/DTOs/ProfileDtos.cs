using System.ComponentModel.DataAnnotations;

namespace AshuraForge.API.DTOs;
// ─────────────────────────────────────────────────────────────────────────────
// PROFILE DTOs  (Gereksinim 7-8)
// ─────────────────────────────────────────────────────────────────────────────
public class UpdateProfileDto
{
    [MinLength(3, ErrorMessage = "Kullanıcı adı en az 3 karakter olmalıdır.")]
    public string? Username { get; set; }

    [EmailAddress(ErrorMessage = "Geçerli bir email giriniz.")]
    public string? Email { get; set; }

    public string? CurrentPassword { get; set; }

    [MinLength(6, ErrorMessage = "Yeni şifre en az 6 karakter olmalıdır.")]
    public string? NewPassword { get; set; }
}

public class UpdateProfileImageDto
{
    [Required(ErrorMessage = "Profil resmi URL'si zorunludur.")]
    [Url(ErrorMessage = "Geçerli bir URL giriniz.")]
    public string ProfileImageUrl { get; set; } = string.Empty;
}

public class ProfileResponseDto
{
    public int Id { get; set; }
    public string Username { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string? ProfileImageUrl { get; set; }
    public string Title { get; set; } = string.Empty;
    public int TotalWorkouts { get; set; }
    public int BadgeCount { get; set; }
    public DateTime CreatedAt { get; set; }
}
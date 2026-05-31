using System.ComponentModel.DataAnnotations;

namespace AshuraForge.API.DTOs;

// ─────────────────────────────────────────────────────────────────────────────
// AUTH DTOs  (Gereksinim 1-2)
// ─────────────────────────────────────────────────────────────────────────────
public class RegisterDto
{
    [Required(ErrorMessage = "Kullanıcı adı zorunludur.")]
    [MinLength(3, ErrorMessage = "Kullanıcı adı en az 3 karakter olmalıdır.")]
    public string Username { get; set; } = string.Empty;

    [Required(ErrorMessage = "Email zorunludur.")]
    [EmailAddress(ErrorMessage = "Geçerli bir email adresi giriniz.")]
    public string Email { get; set; } = string.Empty;

    [Required(ErrorMessage = "Şifre zorunludur.")]
    [MinLength(6, ErrorMessage = "Şifre en az 6 karakter olmalıdır.")]
    public string Password { get; set; } = string.Empty;
}

public class LoginDto
{
    [Required(ErrorMessage = "Email zorunludur.")]
    [EmailAddress]
    public string Email { get; set; } = string.Empty;

    [Required(ErrorMessage = "Şifre zorunludur.")]
    public string Password { get; set; } = string.Empty;
}

public class AuthResponseDto
{
    public string Token { get; set; } = string.Empty;
    public string Username { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Title { get; set; } = string.Empty;
    public string? ProfileImageUrl { get; set; }
    public DateTime ExpiresAt { get; set; }
}
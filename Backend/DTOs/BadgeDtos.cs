using System.ComponentModel.DataAnnotations;

namespace AshuraForge.API.DTOs;
// ─────────────────────────────────────────────────────────────────────────────
// BADGE DTOs  (Gereksinim 5)
// ─────────────────────────────────────────────────────────────────────────────
public class BadgeResponseDto
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string Icon { get; set; } = string.Empty;
    public int RequiredWorkouts { get; set; }
    public DateTime? EarnedAt { get; set; }    // null ise henüz kazanılmadı
    public bool IsEarned { get; set; }
}
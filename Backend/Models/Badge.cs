namespace AshuraForge.API.Models;
// ─────────────────────────────────────────────────────────────────────────────
// BADGE  (Gereksinim 5)
// ─────────────────────────────────────────────────────────────────────────────
public class Badge
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string Icon { get; set; } = string.Empty;          // emoji veya URL
    public int RequiredWorkouts { get; set; }                 // Kaç antrenman sonrası kazanılır

    // Navigation
    public ICollection<UserBadge> UserBadges { get; set; } = new List<UserBadge>();
}

public class UserBadge
{
    public int UserId { get; set; }
    public int BadgeId { get; set; }
    public DateTime EarnedAt { get; set; } = DateTime.UtcNow;

    // Navigation
    public User User { get; set; } = null!;
    public Badge Badge { get; set; } = null!;
}

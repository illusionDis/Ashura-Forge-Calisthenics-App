namespace AshuraForge.API.Models;
// ─────────────────────────────────────────────────────────────────────────────
// USER
// ─────────────────────────────────────────────────────────────────────────────
public class User
{
    public int Id { get; set; }
    public string Username { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string PasswordHash { get; set; } = string.Empty;
    public string? ProfileImageUrl { get; set; }
    public string Title { get; set; } = "Acemi Savaşçı";       // Gereksinim 9
    public int TotalWorkouts { get; set; } = 0;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    // Navigation
    public ICollection<Workout> Workouts { get; set; } = new List<Workout>();
    public ICollection<UserBadge> UserBadges { get; set; } = new List<UserBadge>();
    public ICollection<Notification> Notifications { get; set; } = new List<Notification>();
    public ICollection<UserProgress> ProgressRecords { get; set; } = new List<UserProgress>();
}
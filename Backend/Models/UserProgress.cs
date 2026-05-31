namespace AshuraForge.API.Models;
// ─────────────────────────────────────────────────────────────────────────────
// USER PROGRESS  (Gereksinim 10)
// ─────────────────────────────────────────────────────────────────────────────
public class UserProgress
{
    public int Id { get; set; }
    public int UserId { get; set; }
    public DateTime Date { get; set; } = DateTime.UtcNow.Date;
    public int WorkoutsCompletedToday { get; set; } = 0;
    public int TotalWorkoutsAllTime { get; set; } = 0;
    public int TotalMinutesAllTime { get; set; } = 0;
    public string CurrentTitle { get; set; } = "Acemi Savaşçı";
    public int BadgeCount { get; set; } = 0;

    // Navigation
    public User User { get; set; } = null!;
}
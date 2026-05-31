namespace AshuraForge.API.Models;
// ─────────────────────────────────────────────────────────────────────────────
// WORKOUT  (Gereksinim 3-4)
// ─────────────────────────────────────────────────────────────────────────────
public class Workout
{
    public int Id { get; set; }
    public int UserId { get; set; }
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
    public string? Category { get; set; }        // Örn: Cardio, Strength, Flexibility
    public int DurationMinutes { get; set; }
    public DateTime WorkoutDate { get; set; } = DateTime.UtcNow;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    // Navigation
    public User User { get; set; } = null!;
}
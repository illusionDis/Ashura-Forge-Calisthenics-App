using System.ComponentModel.DataAnnotations;

namespace AshuraForge.API.DTOs;
// ─────────────────────────────────────────────────────────────────────────────
// PROGRESS DTOs  (Gereksinim 9-10)
// ─────────────────────────────────────────────────────────────────────────────
public class ProgressResponseDto
{
    public string CurrentTitle { get; set; } = string.Empty;
    public int TotalWorkouts { get; set; }
    public int TotalMinutes { get; set; }
    public int BadgeCount { get; set; }
    public string NextTitle { get; set; } = string.Empty;
    public int WorkoutsToNextTitle { get; set; }
    public List<WorkoutResponseDto> RecentWorkouts { get; set; } = new();
    public List<BadgeResponseDto> EarnedBadges { get; set; } = new();
}
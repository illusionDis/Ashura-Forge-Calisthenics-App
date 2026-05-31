using System.ComponentModel.DataAnnotations;

namespace AshuraForge.API.DTOs;
// ─────────────────────────────────────────────────────────────────────────────
// WORKOUT DTOs  (Gereksinim 3-4)
// ─────────────────────────────────────────────────────────────────────────────
public class CreateWorkoutDto
{
    [Required(ErrorMessage = "Antrenman adı zorunludur.")]
    [MinLength(2, ErrorMessage = "Antrenman adı en az 2 karakter olmalıdır.")]
    public string Name { get; set; } = string.Empty;

    public string? Description { get; set; }

    public string? Category { get; set; }

    [Range(1, 480, ErrorMessage = "Süre 1-480 dakika arasında olmalıdır.")]
    public int DurationMinutes { get; set; } = 30;

    public DateTime? WorkoutDate { get; set; }
}

public class WorkoutResponseDto
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
    public string? Category { get; set; }
    public int DurationMinutes { get; set; }
    public DateTime WorkoutDate { get; set; }
    public DateTime CreatedAt { get; set; }
}
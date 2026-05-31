using AshuraForge.API.Data;
using AshuraForge.API.DTOs;
using AshuraForge.API.Models;
using Microsoft.EntityFrameworkCore;

namespace AshuraForge.API.Services;

public interface IWorkoutService
{
    Task<WorkoutResponseDto> AddWorkoutAsync(int userId, CreateWorkoutDto dto);
    Task DeleteWorkoutAsync(int userId, int workoutId);
    Task<List<WorkoutResponseDto>> GetUserWorkoutsAsync(int userId);
}

public class WorkoutService : IWorkoutService
{
    private readonly AppDbContext _db;
    private readonly IBadgeService _badgeService;

    public WorkoutService(AppDbContext db, IBadgeService badgeService)
    {
        _db = db;
        _badgeService = badgeService;
    }

    // ── GEREKSİNİM 3: Antrenman ekle/POST ────────────────────────────────────
    public async Task<WorkoutResponseDto> AddWorkoutAsync(int userId, CreateWorkoutDto dto)
    {
        var user = await _db.Users.FindAsync(userId)
            ?? throw new KeyNotFoundException("Kullanıcı bulunamadı.");

        var workout = new Workout
        {
            UserId = userId,
            Name = dto.Name,
            Description = dto.Description,
            Category = dto.Category,
            DurationMinutes = dto.DurationMinutes,
            WorkoutDate = dto.WorkoutDate ?? DateTime.UtcNow,
            CreatedAt = DateTime.UtcNow
        };

        _db.Workouts.Add(workout);

        // Kullanıcının toplam antrenman sayısını artır
        user.TotalWorkouts++;

        // Title güncelle (Gereksinim 9)
        var newTitle = TitleLevels.GetTitle(user.TotalWorkouts);
        if (newTitle != user.Title)
        {
            var oldTitle = user.Title;
            user.Title = newTitle;

            // Title değişim bildirimi
            _db.Notifications.Add(new Notification
            {
                UserId = userId,
                Message = $"🎖️ Tebrikler! Yeni unvanın: {newTitle}",
                Type = "title"
            });
        }

        // Progress güncelle
        var progress = await _db.UserProgresses
            .FirstOrDefaultAsync(p => p.UserId == userId);

        if (progress != null)
        {
            progress.TotalWorkoutsAllTime = user.TotalWorkouts;
            progress.TotalMinutesAllTime += dto.DurationMinutes;
            progress.CurrentTitle = user.Title;
            progress.Date = DateTime.UtcNow;
        }

        await _db.SaveChangesAsync();

        // Rozet kontrolü (Gereksinim 5)
        await _badgeService.CheckAndAwardBadgesAsync(userId);

        return MapToDto(workout);
    }

    // ── GEREKSİNİM 4: Antrenman sil/DELETE ───────────────────────────────────
    public async Task DeleteWorkoutAsync(int userId, int workoutId)
    {
        var workout = await _db.Workouts
            .FirstOrDefaultAsync(w => w.Id == workoutId && w.UserId == userId)
            ?? throw new KeyNotFoundException("Antrenman bulunamadı veya bu antrenman size ait değil.");

        var user = await _db.Users.FindAsync(userId)!;
        if (user != null && user.TotalWorkouts > 0)
        {
            user.TotalWorkouts--;
            user.Title = TitleLevels.GetTitle(user.TotalWorkouts);

            // Progress güncelle
            var progress = await _db.UserProgresses
                .FirstOrDefaultAsync(p => p.UserId == userId);
            if (progress != null)
            {
                progress.TotalWorkoutsAllTime = user.TotalWorkouts;
                progress.TotalMinutesAllTime = Math.Max(0, progress.TotalMinutesAllTime - workout.DurationMinutes);
                progress.CurrentTitle = user.Title;
            }
        }

        _db.Workouts.Remove(workout);
        await _db.SaveChangesAsync();
    }

    public async Task<List<WorkoutResponseDto>> GetUserWorkoutsAsync(int userId)
    {
        var workouts = await _db.Workouts
            .Where(w => w.UserId == userId)
            .OrderByDescending(w => w.WorkoutDate)
            .ToListAsync();

        return workouts.Select(MapToDto).ToList();
    }

    private static WorkoutResponseDto MapToDto(Workout w) => new()
    {
        Id = w.Id,
        Name = w.Name,
        Description = w.Description,
        Category = w.Category,
        DurationMinutes = w.DurationMinutes,
        WorkoutDate = w.WorkoutDate,
        CreatedAt = w.CreatedAt
    };
}

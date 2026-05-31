using AshuraForge.API.Data;
using AshuraForge.API.DTOs;
using AshuraForge.API.Models;
using Microsoft.EntityFrameworkCore;

namespace AshuraForge.API.Services;
// ─────────────────────────────────────────────────────────────────────────────
// GEREKSİNİM 9-10: Title kazan/PATCH + Progress tracking/GET
// ─────────────────────────────────────────────────────────────────────────────
public interface IProgressService
{
    Task<ProgressResponseDto> GetProgressAsync(int userId);
}

public class ProgressService : IProgressService
{
    private readonly AppDbContext _db;
    private readonly IBadgeService _badgeService;

    public ProgressService(AppDbContext db, IBadgeService badgeService)
    {
        _db = db;
        _badgeService = badgeService;
    }

    public async Task<ProgressResponseDto> GetProgressAsync(int userId)
    {
        var user = await _db.Users
            .Include(u => u.UserBadges)
            .FirstOrDefaultAsync(u => u.Id == userId)
            ?? throw new KeyNotFoundException("Kullanıcı bulunamadı.");

        var progress = await _db.UserProgresses
            .FirstOrDefaultAsync(p => p.UserId == userId);

        var recentWorkouts = await _db.Workouts
            .Where(w => w.UserId == userId)
            .OrderByDescending(w => w.WorkoutDate)
            .Take(5)
            .Select(w => new WorkoutResponseDto
            {
                Id = w.Id,
                Name = w.Name,
                Description = w.Description,
                Category = w.Category,
                DurationMinutes = w.DurationMinutes,
                WorkoutDate = w.WorkoutDate,
                CreatedAt = w.CreatedAt
            })
            .ToListAsync();

        var earnedBadges = await _badgeService.GetAllBadgesAsync(userId);
        var earned = earnedBadges.Where(b => b.IsEarned).ToList();

        // Bir sonraki title hesapla (Gereksinim 9)
        var nextLevel = TitleLevels.Levels
            .FirstOrDefault(l => l.MinWorkouts > user.TotalWorkouts);
        var nextTitle = nextLevel.Title ?? "Maksimum Seviye";
        var workoutsNeeded = nextLevel.MinWorkouts > 0
            ? nextLevel.MinWorkouts - user.TotalWorkouts
            : 0;

        return new ProgressResponseDto
        {
            CurrentTitle = user.Title,
            TotalWorkouts = user.TotalWorkouts,
            TotalMinutes = progress?.TotalMinutesAllTime ?? 0,
            BadgeCount = user.UserBadges.Count,
            NextTitle = nextTitle,
            WorkoutsToNextTitle = workoutsNeeded,
            RecentWorkouts = recentWorkouts,
            EarnedBadges = earned
        };
    }
}
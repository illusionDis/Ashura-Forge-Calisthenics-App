using AshuraForge.API.Data;
using AshuraForge.API.DTOs;
using AshuraForge.API.Models;
using Microsoft.EntityFrameworkCore;

namespace AshuraForge.API.Services;

public interface IBadgeService
{
    Task CheckAndAwardBadgesAsync(int userId);
    Task<List<BadgeResponseDto>> GetAllBadgesAsync(int userId);
}

public class BadgeService : IBadgeService
{
    private readonly AppDbContext _db;

    public BadgeService(AppDbContext db)
    {
        _db = db;
    }

    // ── GEREKSİNİM 5: Rozet kazan/PATCH ─────────────────────────────────────
    public async Task CheckAndAwardBadgesAsync(int userId)
    {
        var user = await _db.Users
            .Include(u => u.UserBadges)
            .FirstOrDefaultAsync(u => u.Id == userId);

        if (user == null) return;

        var earnedBadgeIds = user.UserBadges.Select(ub => ub.BadgeId).ToHashSet();

        var eligibleBadges = await _db.Badges
            .Where(b => !earnedBadgeIds.Contains(b.Id)
                     && b.RequiredWorkouts <= user.TotalWorkouts)
            .ToListAsync();

        foreach (var badge in eligibleBadges)
        {
            _db.UserBadges.Add(new UserBadge
            {
                UserId = userId,
                BadgeId = badge.Id,
                EarnedAt = DateTime.UtcNow
            });

            // Rozet bildirimi
            _db.Notifications.Add(new Notification
            {
                UserId = userId,
                Message = $"{badge.Icon} Yeni rozet kazandın: {badge.Name}! {badge.Description}",
                Type = "badge"
            });
        }

        if (eligibleBadges.Any())
        {
            // Progress'teki rozet sayısını güncelle
            var progress = await _db.UserProgresses
                .FirstOrDefaultAsync(p => p.UserId == userId);
            if (progress != null)
                progress.BadgeCount = earnedBadgeIds.Count + eligibleBadges.Count;

            await _db.SaveChangesAsync();
        }
    }

    public async Task<List<BadgeResponseDto>> GetAllBadgesAsync(int userId)
    {
        var allBadges = await _db.Badges.ToListAsync();

        var earnedBadges = await _db.UserBadges
            .Where(ub => ub.UserId == userId)
            .ToListAsync();

        return allBadges.Select(b =>
        {
            var earned = earnedBadges.FirstOrDefault(ub => ub.BadgeId == b.Id);
            return new BadgeResponseDto
            {
                Id = b.Id,
                Name = b.Name,
                Description = b.Description,
                Icon = b.Icon,
                RequiredWorkouts = b.RequiredWorkouts,
                IsEarned = earned != null,
                EarnedAt = earned?.EarnedAt
            };
        }).ToList();
    }
}

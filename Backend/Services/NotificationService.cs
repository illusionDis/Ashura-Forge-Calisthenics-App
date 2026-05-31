using AshuraForge.API.Data;
using AshuraForge.API.DTOs;
using AshuraForge.API.Models;
using Microsoft.EntityFrameworkCore;

namespace AshuraForge.API.Services;
// ─────────────────────────────────────────────────────────────────────────────
// GEREKSİNİM 6: Bildirim al/GET
// ─────────────────────────────────────────────────────────────────────────────
public interface INotificationService
{
    Task<List<NotificationResponseDto>> GetNotificationsAsync(int userId);
    Task MarkAllAsReadAsync(int userId);
}

public class NotificationService : INotificationService
{
    private readonly AppDbContext _db;

    public NotificationService(AppDbContext db)
    {
        _db = db;
    }

    public async Task<List<NotificationResponseDto>> GetNotificationsAsync(int userId)
    {
        var notifications = await _db.Notifications
            .Where(n => n.UserId == userId)
            .OrderByDescending(n => n.CreatedAt)
            .Take(50) // son 50 bildirim
            .ToListAsync();

        return notifications.Select(n => new NotificationResponseDto
        {
            Id = n.Id,
            Message = n.Message,
            Type = n.Type,
            IsRead = n.IsRead,
            CreatedAt = n.CreatedAt
        }).ToList();
    }

    public async Task MarkAllAsReadAsync(int userId)
    {
        var unread = await _db.Notifications
            .Where(n => n.UserId == userId && !n.IsRead)
            .ToListAsync();

        unread.ForEach(n => n.IsRead = true);
        await _db.SaveChangesAsync();
    }
}
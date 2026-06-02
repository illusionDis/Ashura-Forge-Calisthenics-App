using AshuraForge.API.Data;
using AshuraForge.API.DTOs;
using AshuraForge.API.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Caching.Distributed;
using System.Text.Json;

namespace AshuraForge.API.Services;
// ─────────────────────────────────────────────────────────────────────────────
// GEREKSİNİM 6: Bildirim al/GET  +  Redis Cache
// ─────────────────────────────────────────────────────────────────────────────
public interface INotificationService
{
    Task<List<NotificationResponseDto>> GetNotificationsAsync(int userId);
    Task MarkAllAsReadAsync(int userId);
    Task InvalidateCacheAsync(int userId);
}

public class NotificationService : INotificationService
{
    private readonly AppDbContext          _db;
    private readonly IDistributedCache     _cache;
    private readonly ILogger<NotificationService> _logger;

    private static string CacheKey(int userId) => $"notifications:{userId}";

    public NotificationService(AppDbContext db, IDistributedCache cache, ILogger<NotificationService> logger)
    {
        _db     = db;
        _cache  = cache;
        _logger = logger;
    }

    public async Task<List<NotificationResponseDto>> GetNotificationsAsync(int userId)
    {
        var key = CacheKey(userId);

        // ── Redis cache kontrolü ──────────────────────────────────────────────
        try
        {
            var cached = await _cache.GetStringAsync(key);
            if (cached != null)
            {
                _logger.LogInformation("Redis cache HIT → {Key}", key);
                return JsonSerializer.Deserialize<List<NotificationResponseDto>>(cached)!;
            }
            _logger.LogInformation("Redis cache MISS → {Key}", key);
        }
        catch (Exception ex)
        {
            _logger.LogWarning("Redis erişim hatası: {Message}", ex.Message);
        }

        // ── Veritabanından çek ───────────────────────────────────────────────
        var notifications = await _db.Notifications
            .Where(n => n.UserId == userId)
            .OrderByDescending(n => n.CreatedAt)
            .Take(50)
            .ToListAsync();

        var result = notifications.Select(n => new NotificationResponseDto
        {
            Id        = n.Id,
            Message   = n.Message,
            Type      = n.Type,
            IsRead    = n.IsRead,
            CreatedAt = n.CreatedAt
        }).ToList();

        // ── Redis'e yaz (30 saniye TTL) ───────────────────────────────────────
        try
        {
            var options = new DistributedCacheEntryOptions
            {
                AbsoluteExpirationRelativeToNow = TimeSpan.FromSeconds(30)
            };
            await _cache.SetStringAsync(key, JsonSerializer.Serialize(result), options);
            _logger.LogInformation("Redis cache SET → {Key} (30sn TTL)", key);
        }
        catch (Exception ex)
        {
            _logger.LogWarning("Redis yazma hatası: {Message}", ex.Message);
        }

        return result;
    }

    public async Task MarkAllAsReadAsync(int userId)
    {
        var unread = await _db.Notifications
            .Where(n => n.UserId == userId && !n.IsRead)
            .ToListAsync();

        unread.ForEach(n => n.IsRead = true);
        await _db.SaveChangesAsync();

        // Cache'i invalidate et
        await InvalidateCacheAsync(userId);
    }

    public async Task InvalidateCacheAsync(int userId)
    {
        try
        {
            await _cache.RemoveAsync(CacheKey(userId));
            _logger.LogInformation("Redis cache invalidated → {Key}", CacheKey(userId));
        }
        catch (Exception ex)
        {
            _logger.LogWarning("Redis invalidate hatası: {Message}", ex.Message);
        }
    }
}
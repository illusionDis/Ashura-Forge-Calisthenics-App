using AshuraForge.API.DTOs;
using AshuraForge.API.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace AshuraForge.API.Controllers;
// ─────────────────────────────────────────────────────────────────────────────
// GEREKSİNİM 6: Bildirim al/GET
// ─────────────────────────────────────────────────────────────────────────────
[ApiController]
[Route("api/[controller]")]
[Authorize]
[Produces("application/json")]
public class NotificationController : ControllerBase
{
    private readonly INotificationService _notificationService;
    private readonly ITokenService _tokenService;

    public NotificationController(INotificationService notificationService, ITokenService tokenService)
    {
        _notificationService = notificationService;
        _tokenService = tokenService;
    }

    /// <summary>
    /// GEREKSİNİM 6 - Bildirimleri getir
    /// </summary>
    [HttpGet]
    [ProducesResponseType(typeof(ApiResponse<List<NotificationResponseDto>>), 200)]
    public async Task<IActionResult> GetNotifications()
    {
        var userId = _tokenService.GetUserIdFromToken(User);
        var notifications = await _notificationService.GetNotificationsAsync(userId);
        return Ok(ApiResponse<List<NotificationResponseDto>>.Ok(notifications));
    }

    /// <summary>
    /// Tüm bildirimleri okundu olarak işaretle
    /// </summary>
    [HttpPatch("read-all")]
    [ProducesResponseType(typeof(ApiResponse<string>), 200)]
    public async Task<IActionResult> MarkAllAsRead()
    {
        var userId = _tokenService.GetUserIdFromToken(User);
        await _notificationService.MarkAllAsReadAsync(userId);
        return Ok(ApiResponse<string>.Ok("Tamam", "Tüm bildirimler okundu olarak işaretlendi."));
    }
}
using AshuraForge.API.DTOs;
using AshuraForge.API.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace AshuraForge.API.Controllers;
// ─────────────────────────────────────────────────────────────────────────────
// GEREKSİNİM 5: Rozet kazan/PATCH
// ─────────────────────────────────────────────────────────────────────────────
[ApiController]
[Route("api/[controller]")]
[Authorize]
[Produces("application/json")]
public class BadgeController : ControllerBase
{
    private readonly IBadgeService _badgeService;
    private readonly ITokenService _tokenService;

    public BadgeController(IBadgeService badgeService, ITokenService tokenService)
    {
        _badgeService = badgeService;
        _tokenService = tokenService;
    }

    /// <summary>
    /// Tüm rozetleri listele (kazanılan ve kazanılmayan)
    /// </summary>
    [HttpGet]
    [ProducesResponseType(typeof(ApiResponse<List<BadgeResponseDto>>), 200)]
    public async Task<IActionResult> GetBadges()
    {
        var userId = _tokenService.GetUserIdFromToken(User);
        var badges = await _badgeService.GetAllBadgesAsync(userId);
        return Ok(ApiResponse<List<BadgeResponseDto>>.Ok(badges));
    }

    /// <summary>
    /// GEREKSİNİM 5 - Rozet kontrolü yap ve kazan (antrenman eklendikten sonra otomatik tetiklenir, manuel de çağrılabilir)
    /// </summary>
    [HttpPatch("check")]
    [ProducesResponseType(typeof(ApiResponse<List<BadgeResponseDto>>), 200)]
    public async Task<IActionResult> CheckBadges()
    {
        var userId = _tokenService.GetUserIdFromToken(User);
        await _badgeService.CheckAndAwardBadgesAsync(userId);
        var badges = await _badgeService.GetAllBadgesAsync(userId);
        var earned = badges.Where(b => b.IsEarned).ToList();
        return Ok(ApiResponse<List<BadgeResponseDto>>.Ok(earned, "Rozet kontrolü tamamlandı."));
    }
}
using AshuraForge.API.DTOs;
using AshuraForge.API.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace AshuraForge.API.Controllers;
// ─────────────────────────────────────────────────────────────────────────────
// GEREKSİNİM 9-10: Title kazan + Progress tracking/GET
// ─────────────────────────────────────────────────────────────────────────────
[ApiController]
[Route("api/[controller]")]
[Authorize]
[Produces("application/json")]
[ProducesResponseType(typeof(ApiResponse<string>), 200)]
public class ProgressController : ControllerBase
{
    private readonly IProgressService _progressService;
    private readonly ITokenService _tokenService;

    public ProgressController(IProgressService progressService, ITokenService tokenService)
    {
        _progressService = progressService;
        _tokenService = tokenService;
    }

    /// <summary>
    /// GEREKSİNİM 9 &amp; 10 - Kullanıcının ilerleme durumu (title + istatistikler)
    /// </summary>
    [HttpGet]
    [ProducesResponseType(typeof(ApiResponse<ProgressResponseDto>), 200)]
    public async Task<IActionResult> GetProgress()
    {
        try
        {
            var userId = _tokenService.GetUserIdFromToken(User);
            var result = await _progressService.GetProgressAsync(userId);
            return Ok(ApiResponse<ProgressResponseDto>.Ok(result));
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(ApiResponse<string>.Fail(ex.Message));
        }
    }
    
}
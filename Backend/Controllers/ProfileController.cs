using AshuraForge.API.DTOs;
using AshuraForge.API.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace AshuraForge.API.Controllers;
// ─────────────────────────────────────────────────────────────────────────────
// GEREKSİNİM 7-8: Profil fotoğrafı değiştir/PUT + Profil düzenle/PATCH
// ─────────────────────────────────────────────────────────────────────────────
[ApiController]
[Route("api/[controller]")]
[Authorize]
[Produces("application/json")]
public class ProfileController : ControllerBase
{
    private readonly IProfileService _profileService;
    private readonly ITokenService _tokenService;

    public ProfileController(IProfileService profileService, ITokenService tokenService)
    {
        _profileService = profileService;
        _tokenService = tokenService;
    }

    /// <summary>
    /// Profil bilgilerini getir
    /// </summary>
    [HttpGet]
    [ProducesResponseType(typeof(ApiResponse<ProfileResponseDto>), 200)]
    public async Task<IActionResult> GetProfile()
    {
        var userId = _tokenService.GetUserIdFromToken(User);
        var profile = await _profileService.GetProfileAsync(userId);
        return Ok(ApiResponse<ProfileResponseDto>.Ok(profile));
    }

    /// <summary>
    /// GEREKSİNİM 7 - Profil fotoğrafı değiştir
    /// </summary>
    [HttpPut("image")]
    [ProducesResponseType(typeof(ApiResponse<ProfileResponseDto>), 200)]
    [ProducesResponseType(typeof(ApiResponse<string>), 400)]
    public async Task<IActionResult> UpdateProfileImage([FromBody] UpdateProfileImageDto dto)
    {
        if (!ModelState.IsValid)
            return BadRequest(ApiResponse<string>.Fail(
                string.Join(", ", ModelState.Values
                    .SelectMany(v => v.Errors)
                    .Select(e => e.ErrorMessage))));

        try
        {
            var userId = _tokenService.GetUserIdFromToken(User);
            var result = await _profileService.UpdateProfileImageAsync(userId, dto);
            return Ok(ApiResponse<ProfileResponseDto>.Ok(result, "Profil fotoğrafı güncellendi."));
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(ApiResponse<string>.Fail(ex.Message));
        }
    }

    /// <summary>
    /// GEREKSİNİM 8 - Profil düzenle (kullanıcı adı, email, şifre)
    /// </summary>
    [HttpPatch]
    [ProducesResponseType(typeof(ApiResponse<ProfileResponseDto>), 200)]
    [ProducesResponseType(typeof(ApiResponse<string>), 400)]
    public async Task<IActionResult> UpdateProfile([FromBody] UpdateProfileDto dto)
    {
        if (!ModelState.IsValid)
            return BadRequest(ApiResponse<string>.Fail(
                string.Join(", ", ModelState.Values
                    .SelectMany(v => v.Errors)
                    .Select(e => e.ErrorMessage))));

        try
        {
            var userId = _tokenService.GetUserIdFromToken(User);
            var result = await _profileService.UpdateProfileAsync(userId, dto);
            return Ok(ApiResponse<ProfileResponseDto>.Ok(result, "Profil güncellendi."));
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(ApiResponse<string>.Fail(ex.Message));
        }
        catch (UnauthorizedAccessException ex)
        {
            return Unauthorized(ApiResponse<string>.Fail(ex.Message));
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(ApiResponse<string>.Fail(ex.Message));
        }
    }
}
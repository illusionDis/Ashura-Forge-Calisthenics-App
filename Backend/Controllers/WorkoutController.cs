using AshuraForge.API.DTOs;
using AshuraForge.API.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace AshuraForge.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
[Produces("application/json")]
public class WorkoutController : ControllerBase
{
    private readonly IWorkoutService _workoutService;
    private readonly ITokenService _tokenService;

    public WorkoutController(IWorkoutService workoutService, ITokenService tokenService)
    {
        _workoutService = workoutService;
        _tokenService = tokenService;
    }

    /// <summary>
    /// Kullanıcının tüm antrenmanlarını listele
    /// </summary>
    [HttpGet]
    [ProducesResponseType(typeof(ApiResponse<List<WorkoutResponseDto>>), 200)]
    public async Task<IActionResult> GetMyWorkouts()
    {
        var userId = _tokenService.GetUserIdFromToken(User);
        var workouts = await _workoutService.GetUserWorkoutsAsync(userId);
        return Ok(ApiResponse<List<WorkoutResponseDto>>.Ok(workouts));
    }

    /// <summary>
    /// GEREKSİNİM 3 - Antrenman ekle
    /// </summary>
    [HttpPost]
    [ProducesResponseType(typeof(ApiResponse<WorkoutResponseDto>), 201)]
    [ProducesResponseType(typeof(ApiResponse<string>), 400)]
    public async Task<IActionResult> AddWorkout([FromBody] CreateWorkoutDto dto)
    {
        if (!ModelState.IsValid)
            return BadRequest(ApiResponse<string>.Fail(
                string.Join(", ", ModelState.Values
                    .SelectMany(v => v.Errors)
                    .Select(e => e.ErrorMessage))));

        try
        {
            var userId = _tokenService.GetUserIdFromToken(User);
            var result = await _workoutService.AddWorkoutAsync(userId, dto);
            return CreatedAtAction(nameof(GetMyWorkouts),
                ApiResponse<WorkoutResponseDto>.Ok(result, "Antrenman başarıyla eklendi! 💪"));
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(ApiResponse<string>.Fail(ex.Message));
        }
    }

    /// <summary>
    /// GEREKSİNİM 4 - Antrenman sil
    /// </summary>
    [HttpDelete("{id}")]
    [ProducesResponseType(typeof(ApiResponse<string>), 200)]
    [ProducesResponseType(typeof(ApiResponse<string>), 404)]
    public async Task<IActionResult> DeleteWorkout(int id)
    {
        try
        {
            var userId = _tokenService.GetUserIdFromToken(User);
            await _workoutService.DeleteWorkoutAsync(userId, id);
            return Ok(ApiResponse<string>.Ok("Silindi", "Antrenman başarıyla silindi."));
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(ApiResponse<string>.Fail(ex.Message));
        }
    }
}

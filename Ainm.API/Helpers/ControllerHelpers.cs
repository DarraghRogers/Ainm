using System.Security.Claims;

public static class ControllerHelpers
{
    public static int GetUserIdFromClaims(ClaimsPrincipal user)
    {
        // Adjust claim type if using different claim for user id
        var userIdClaim = user.FindFirst(ClaimTypes.NameIdentifier);
        if (userIdClaim == null)
            throw new UnauthorizedAccessException("User ID claim not found.");
        return int.Parse(userIdClaim.Value);
    }
}
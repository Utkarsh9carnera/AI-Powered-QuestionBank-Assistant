using Google.Apis.Auth;
using Microsoft.AspNetCore.Mvc;
using QuestionBankAssistant.DTOs;

namespace QuestionBankAssistant.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly IConfiguration _configuration;

        public AuthController(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        [HttpPost("google-login")]
        public async Task<IActionResult> GoogleLogin(
            [FromBody] GoogleLoginRequest request)
        {
            try
            {
                var payload =
                    await GoogleJsonWebSignature.ValidateAsync(
                        request.IdToken,
                        new GoogleJsonWebSignature.ValidationSettings
                        {
                            Audience = new[]
                            {
                                _configuration["GoogleAuth:ClientId"]
                            }
                        });

                return Ok(new
{
    id = payload.Subject,
    email = payload.Email,
    name = payload.Name,
    picture = payload.Picture,
    given_name = payload.GivenName
});
            }
            catch
            {
                return Unauthorized("Invalid Google Token");
            }
        }
    }
}
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
    message = "AuthController reached",
    email = payload.Email
});
            }
            catch
            {
                return Unauthorized("Invalid Google Token");
            }
        }
    }
}
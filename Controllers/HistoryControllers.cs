using Microsoft.AspNetCore.Mvc;
using QuestionBankAssistant.data;

namespace QuestionBankAssistant.Controllers;

[ApiController]
[Route("api/[controller]")]
public class HistoryController : ControllerBase
{
    private readonly AppDbContext _context;

    public HistoryController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet("{email}")]
    public IActionResult GetHistory(string email)
    {
        var history = _context.SearchHistories
            .Where(x => x.UserEmail == email)
            .OrderByDescending(x => x.CreatedAt)
            .ToList();

        return Ok(history);
    }
}
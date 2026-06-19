using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using QuestionBankAssistant.data;
using QuestionBankAssistant.Models;
using QuestionBankAssistant.Services;

namespace QuestionBankAssistant.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AIApiController : ControllerBase
{
    private readonly AppDbContext _context;
    private readonly GroqService _groqService;
    private readonly EmbeddingService _embeddingService;
    private readonly VectorSearchService _vectorSearch;

    public AIApiController(
        AppDbContext context,
        GroqService groqService,
        EmbeddingService embeddingService,
        VectorSearchService vectorSearch)
    {
        _context = context;
        _groqService = groqService;
        _embeddingService = embeddingService;
        _vectorSearch = vectorSearch;
    }

    [HttpGet("ask")]
    public async Task<IActionResult> Ask(
        string query,
        string? userEmail = "guest")
    {
        if (string.IsNullOrWhiteSpace(query))
        {
            return BadRequest("Query cannot be empty");
        }

        userEmail = string.IsNullOrWhiteSpace(userEmail)
            ? "guest"
            : userEmail;

        // =====================
        // STEP 1 - Exact Match
        // =====================

        var searchText = query.ToLower().Trim();

var exactMatch = _context.Questions
    .AsEnumerable()
    .FirstOrDefault(q =>
        q.QuestionText.ToLower()
        .Contains(searchText));

        if (exactMatch != null)
        {
            _context.SearchHistories.Add(
                new SearchHistory
                {
                    UserEmail = userEmail,
                    Question = query,
                    Answer = exactMatch.AnswerText,
                    CreatedAt = DateTime.Now
                });

            await _context.SaveChangesAsync();

            return Ok(new
            {
                source = "Question Bank",
                question = exactMatch.QuestionText,
                answer = exactMatch.AnswerText,
                category = exactMatch.Category
            });
        }

        // =====================
        // STEP 2 - Vector Search
        // =====================

        try
        {
            var queryVector =
                await _embeddingService.GenerateEmbedding(query);

            double bestScore = 0;
            Question? bestQuestion = null;

            var embeddings =
                _context.QuestionEmbeddings.ToList();

            foreach (var emb in embeddings)
            {
                try
                {
                    var storedVector =
                        emb.VectorData
                        .Split(',')
                        .Select(float.Parse)
                        .ToList();

                    var similarity =
                        _vectorSearch.CosineSimilarity(
                            queryVector,
                            storedVector);

                    if (similarity > bestScore)
                    {
                        bestScore = similarity;

                        bestQuestion =
                            _context.Questions
                            .FirstOrDefault(q =>
                                q.QuestionId == emb.QuestionId);
                    }
                }
                catch
                {
                    // Skip invalid vectors
                }
            }

            if (bestQuestion != null && bestScore > 0.80)
            {
                _context.SearchHistories.Add(
                    new SearchHistory
                    {
                        UserEmail = userEmail,
                        Question = query,
                        Answer = bestQuestion.AnswerText,
                        CreatedAt = DateTime.Now
                    });

                await _context.SaveChangesAsync();

                return Ok(new
                {
                    source = "Vector Search",
                    score = bestScore,
                    question = bestQuestion.QuestionText,
                    answer = bestQuestion.AnswerText,
                    category = bestQuestion.Category
                });
            }
        }
        catch (Exception ex)
        {
            Console.WriteLine(
                $"Vector Search Error: {ex.Message}");
        }

        // =====================
        // STEP 3 - GROQ AI
        // =====================

        try
        {
            var aiAnswer =
                await _groqService.AskAI(query);

            _context.SearchHistories.Add(
                new SearchHistory
                {
                    UserEmail = userEmail,
                    Question = query,
                    Answer = aiAnswer,
                    CreatedAt = DateTime.Now
                });

            await _context.SaveChangesAsync();

            return Ok(new
            {
                source = "Groq AI",
                question = query,
                answer = aiAnswer
            });
        }
        catch (Exception ex)
        {
            return BadRequest(
                $"AI Error: {ex.Message}");
        }
    }
    [HttpGet("historycount")]
public IActionResult HistoryCount()
{
    return Ok(new
    {
        count = _context.SearchHistories.Count()
    });
}
[HttpGet("testinsert")]
public async Task<IActionResult> TestInsert()
{
    var item = new SearchHistory
    {
        UserEmail = "guest",
        Question = "Test Question",
        Answer = "Test Answer",
        CreatedAt = DateTime.Now
    };

    _context.SearchHistories.Add(item);

    await _context.SaveChangesAsync();

    return Ok("Inserted Successfully");
}
[HttpDelete("history/{email}")]
public async Task<IActionResult> ClearHistory(
    string email)
{
    var items =
        _context.SearchHistories
        .Where(x => x.UserEmail == email);

    _context.SearchHistories.RemoveRange(items);

    await _context.SaveChangesAsync();

    return Ok(new
    {
        message = "History Cleared"
    });
}
    [HttpGet("history")]
    public IActionResult GetHistory(string userEmail)
    {
        if (string.IsNullOrWhiteSpace(userEmail))
        {
            return BadRequest("User email is required");
        }

        var history = _context.SearchHistories
            .AsNoTracking()
            .Where(x => x.UserEmail == userEmail)
            .OrderByDescending(x => x.CreatedAt)
            .ToList();

        return Ok(history);
    }
}
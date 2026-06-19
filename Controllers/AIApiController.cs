using Microsoft.AspNetCore.Mvc;
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

        // =====================
        // STEP 1 - Exact Match
        // =====================

        var exactMatch = _context.Questions
            .FirstOrDefault(q =>
                q.QuestionText.ToLower()
                .Contains(query.ToLower()));

        if (exactMatch != null)
        {
            _context.SearchHistories.Add(
                new SearchHistory
                {
                    UserEmail = userEmail ?? "guest",
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
                                q.QuestionId ==
                                emb.QuestionId);
                    }
                }
                catch
                {
                }
            }

            if (bestQuestion != null &&
                bestScore > 0.80)
            {
                _context.SearchHistories.Add(
                    new SearchHistory
                    {
                        UserEmail = userEmail ?? "guest",
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
        // STEP 3 - AI Fallback
        // =====================

        try
        {
            var aiAnswer =
                await _groqService.AskAI(query);

            _context.SearchHistories.Add(
                new SearchHistory
                {
                    UserEmail = userEmail ?? "guest",
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

    [HttpGet("history")]
    public IActionResult GetHistory(
        string userEmail)
    {
        var history =
            _context.SearchHistories
            .Where(x =>
                x.UserEmail == userEmail)
            .OrderByDescending(x =>
                x.CreatedAt)
            .ToList();

        return Ok(history);
    }
}
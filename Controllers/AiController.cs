using Microsoft.AspNetCore.Mvc;
using QuestionBankAssistant.data;
using QuestionBankAssistant.Models;
using QuestionBankAssistant.Services;

namespace QuestionBankAssistant.Controllers
{
    public class AIController : Controller
    {
        private readonly AppDbContext _context;
        private readonly GroqService _groqService;
        private readonly EmbeddingService _embeddingService;
        private readonly VectorSearchService _vectorSearch;

        public AIController(
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

        public async Task<IActionResult> Index(string query)
        {
            if (string.IsNullOrWhiteSpace(query))
                return View();

            // ==========================
            // STEP 1: Exact Match Search
            // ==========================
            var searchText = query
    .ToLower()
    .Trim()
    .Replace("?", "");

var exactMatch = _context.Questions
    .AsEnumerable()
    .FirstOrDefault(q =>
        q.QuestionText
            .ToLower()
            .Replace("?", "")
            .Contains(searchText));
            Console.WriteLine($"Searching: {searchText}");
Console.WriteLine($"Found: {exactMatch?.QuestionText}");

            if (exactMatch != null)
            {
                Console.WriteLine("Using Exact Match");
                return View(exactMatch);
            }

            // ==========================
            // STEP 2: Vector Search
            // ==========================
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
                        // Skip bad vectors
                    }
                }

                Console.WriteLine($"Best Score = {bestScore}");
                Console.WriteLine($"Best Question = {bestQuestion?.QuestionText}");

                if (bestQuestion != null && bestScore > 0.80)
                {
                    Console.WriteLine("Using Vector Search");
                    return View(bestQuestion);
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Vector Search Error: {ex.Message}");
            }

            // ==========================
            // STEP 3: GROQ FALLBACK
            // ==========================
            Console.WriteLine("Using Groq");

            try
            {
                var aiAnswer =
                    await _groqService.AskAI(query);

                var result = new Question
                {
                    QuestionText = query,
                    AnswerText = aiAnswer,
                    Category = "AI Generated",
                    CreatedDate = DateTime.Now
                };

                return View(result);
            }
            catch (Exception ex)
            {
                return Content(
                    $"Groq Error: {ex.Message}"
                );
            }
        }

        public async Task<IActionResult> TestEmbedding()
        {
            try
            {
                var embedding =
                    await _embeddingService.GenerateEmbedding(
                        "What is React?"
                    );

                return Content(
                    $"Vector Length: {embedding.Count}"
                );
            }
            catch (Exception ex)
            {
                return Content(
                    $"Embedding Error: {ex.Message}"
                );
            }
        }

        public IActionResult TestDb()
{
    try
    {
        var questionCount =
            _context.Questions.Count();

        var embeddingCount =
            _context.QuestionEmbeddings.Count();

        return Content(
            $"Questions: {questionCount} | Embeddings: {embeddingCount}"
        );
    }
    catch (Exception ex)
    {
        return Content(
            $"Error: {ex.Message}\n\n{ex.StackTrace}"
        );
    }
}

[HttpPost]
[Route("api/ai/ask")]
public async Task<IActionResult> Ask([FromBody] AskRequest request)
{
    if (string.IsNullOrWhiteSpace(request.Question))
        return BadRequest("Question is required");

    // Exact Match Search
    var exactMatch = _context.Questions
        .FirstOrDefault(q =>
            q.QuestionText.ToLower()
            .Contains(request.Question.ToLower()));

    if (exactMatch != null)
    {
        return Ok(new
        {
            answer = exactMatch.AnswerText,
            source = "Database"
        });
    }

    // Vector Search
    try
    {
        var queryVector =
            await _embeddingService.GenerateEmbedding(
                request.Question
            );

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
                        storedVector
                    );

                if (similarity > bestScore)
                {
                    bestScore = similarity;

                    bestQuestion =
                        _context.Questions
                        .FirstOrDefault(q =>
                            q.QuestionId ==
                            emb.QuestionId
                        );
                }
            }
            catch
            {
            }
        }

        if (bestQuestion != null &&
            bestScore > 0.80)
        {
            return Ok(new
            {
                answer = bestQuestion.AnswerText,
                source = "Vector Search"
            });
        }
    }
    catch
    {
    }

    // Groq Fallback
    try
    {
        var aiAnswer =
            await _groqService.AskAI(
                request.Question
            );

        return Ok(new
        {
            answer = aiAnswer,
            source = "Groq AI"
        });
    }
    catch (Exception ex)
    {
        return BadRequest(
            $"AI Error: {ex.Message}"
        );
    }
}
}
}
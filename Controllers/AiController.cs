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

            if (exactMatch != null)
            {
                return View(exactMatch);
            }

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
                    return View(bestQuestion);
                }
            }
            catch
            {
            }

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
                    $"Groq Error: {ex.Message}");
            }
        }

        [HttpPost]
        [Route("api/ai/ask")]
        public async Task<IActionResult> Ask(
            [FromBody] AskRequest request)
        {
            if (string.IsNullOrWhiteSpace(request.Question))
                return BadRequest("Question is required");

            string userEmail =
                request.UserEmail ?? "guest";

            // ======================
            // Exact Match Search
            // ======================

            var exactMatch = _context.Questions
                .FirstOrDefault(q =>
                    q.QuestionText.ToLower()
                    .Contains(
                        request.Question.ToLower()));

            if (exactMatch != null)
            {
                _context.SearchHistories.Add(
                    new SearchHistory
                    {
                        UserEmail = userEmail,
                        Question = request.Question,
                        Answer = exactMatch.AnswerText,
                        CreatedAt = DateTime.Now
                    });

                await _context.SaveChangesAsync();

                return Ok(new
                {
                    answer = exactMatch.AnswerText,
                    source = "Database"
                });
            }

            // ======================
            // Vector Search
            // ======================

            try
            {
                var queryVector =
                    await _embeddingService
                    .GenerateEmbedding(
                        request.Question);

                double bestScore = 0;
                Question? bestQuestion = null;

                var embeddings =
                    _context.QuestionEmbeddings
                    .ToList();

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
                            _vectorSearch
                            .CosineSimilarity(
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
                            UserEmail = userEmail,
                            Question = request.Question,
                            Answer = bestQuestion.AnswerText,
                            CreatedAt = DateTime.Now
                        });

                    await _context.SaveChangesAsync();

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

            // ======================
            // Groq Fallback
            // ======================

            try
            {
                var aiAnswer =
                    await _groqService
                    .AskAI(request.Question);

                _context.SearchHistories.Add(
                    new SearchHistory
                    {
                        UserEmail = userEmail,
                        Question = request.Question,
                        Answer = aiAnswer,
                        CreatedAt = DateTime.Now
                    });

                await _context.SaveChangesAsync();

                return Ok(new
                {
                    answer = aiAnswer,
                    source = "Groq AI"
                });
            }
            catch (Exception ex)
            {
                return BadRequest(
                    $"AI Error: {ex.Message}");
            }
        }

        [HttpGet]
        [Route("api/ai/testembedding")]
        public async Task<IActionResult> TestEmbedding()
        {
            try
            {
                var embedding =
                    await _embeddingService
                    .GenerateEmbedding(
                        "What is React?");

                return Ok(new
                {
                    Length = embedding.Count
                });
            }
            catch (Exception ex)
            {
                return BadRequest(
                    $"Embedding Error: {ex.Message}");
            }
        }

        [HttpGet]
        [Route("api/ai/testdb")]
        public IActionResult TestDb()
        {
            try
            {
                var questionCount =
                    _context.Questions.Count();

                var embeddingCount =
                    _context.QuestionEmbeddings.Count();

                return Ok(new
                {
                    Questions = questionCount,
                    Embeddings = embeddingCount
                });
            }
            catch (Exception ex)
            {
                return BadRequest(
                    $"Error: {ex.Message}");
            }
        }
    }
}
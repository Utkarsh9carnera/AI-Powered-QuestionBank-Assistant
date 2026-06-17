using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using QuestionBankAssistant.data;
using QuestionBankAssistant.Models;
using QuestionBankAssistant.Services;

namespace QuestionBankAssistant.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class QuestionsController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly EmbeddingService _embeddingService;

        public QuestionsController(
            AppDbContext context,
            EmbeddingService embeddingService)
        {
            _context = context;
            _embeddingService = embeddingService;
        }

        // GET ALL QUESTIONS
        [HttpGet]
        public async Task<IActionResult> GetQuestions()
        {
            var questions =
                await _context.Questions.ToListAsync();

            return Ok(questions);
        }

        // GET QUESTION BY ID
        [HttpGet("{id}")]
        public async Task<IActionResult> GetQuestion(int id)
        {
            var question =
                await _context.Questions.FindAsync(id);

            if (question == null)
                return NotFound();

            return Ok(question);
        }

        // ADD QUESTION + EMBEDDING
        [HttpPost]
        public async Task<IActionResult> AddQuestion(
            [FromBody] Question question)
        {
            _context.Questions.Add(question);
            await _context.SaveChangesAsync();

            try
            {
                var vector =
                    await _embeddingService
                    .GenerateEmbedding(
                        question.QuestionText
                    );

                var embedding =
                    new QuestionEmbedding
                    {
                        QuestionId =
                            question.QuestionId,

                        VectorData =
                            string.Join(",", vector)
                    };

                _context.QuestionEmbeddings
                    .Add(embedding);

                await _context.SaveChangesAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine(
                    $"Embedding Error: {ex.Message}"
                );
            }

            return Ok(question);
        }

        // UPDATE QUESTION
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateQuestion(
            int id,
            [FromBody] Question updatedQuestion)
        {
            var question =
                await _context.Questions.FindAsync(id);

            if (question == null)
                return NotFound();

            question.QuestionText =
                updatedQuestion.QuestionText;

            question.AnswerText =
                updatedQuestion.AnswerText;

            question.Category =
                updatedQuestion.Category;

            await _context.SaveChangesAsync();

            return Ok(question);
        }

        // DELETE QUESTION
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteQuestion(
            int id)
        {
            var question =
                await _context.Questions.FindAsync(id);

            if (question == null)
                return NotFound();

            var embedding =
                await _context.QuestionEmbeddings
                .FirstOrDefaultAsync(
                    e => e.QuestionId == id
                );

            if (embedding != null)
            {
                _context.QuestionEmbeddings
                    .Remove(embedding);
            }

            _context.Questions.Remove(question);

            await _context.SaveChangesAsync();

            return Ok();
        }
    }
}
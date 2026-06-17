using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using QuestionBankAssistant.data;
using QuestionBankAssistant.Models;

namespace QuestionBankAssistant.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class QuestionsController : ControllerBase
    {
        private readonly AppDbContext _context;

        public QuestionsController(AppDbContext context)
        {
            _context = context;
        }

        // GET ALL QUESTIONS
        [HttpGet]
        public async Task<IActionResult> GetQuestions()
        {
            var questions = await _context.Questions.ToListAsync();
            return Ok(questions);
        }

        // SEARCH QUESTION
        [HttpGet("search")]
        public async Task<IActionResult> Search(string query)
        {
            if (string.IsNullOrWhiteSpace(query))
                return BadRequest("Query is required");

            var question = await _context.Questions
                .FirstOrDefaultAsync(q =>
                    q.QuestionText.ToLower()
                    .Contains(query.ToLower()));

            if (question == null)
            {
                return Ok(new
                {
                    answer = "No matching question found."
                });
            }

            return Ok(new
            {
                question = question.QuestionText,
                answer = question.AnswerText,
                category = question.Category
            });
        }

        // GET QUESTION BY ID
        [HttpGet("{id:int}")]
        public async Task<IActionResult> GetQuestion(int id)
        {
            var question =
                await _context.Questions.FindAsync(id);

            if (question == null)
                return NotFound();

            return Ok(question);
        }

        // ADD QUESTION
        [HttpPost]
        public async Task<IActionResult> AddQuestion(
            [FromBody] Question question)
        {
            _context.Questions.Add(question);

            await _context.SaveChangesAsync();

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
            try
            {
                var question =
                    await _context.Questions
                    .FirstOrDefaultAsync(
                        q => q.QuestionId == id);

                if (question == null)
                {
                    return NotFound(new
                    {
                        message =
                            "Question not found"
                    });
                }

                var embeddings =
                    await _context.QuestionEmbeddings
                    .Where(e =>
                        e.QuestionId == id)
                    .ToListAsync();

                if (embeddings.Any())
                {
                    _context.QuestionEmbeddings
                        .RemoveRange(embeddings);
                }

                _context.Questions
                    .Remove(question);

                await _context.SaveChangesAsync();

                return Ok(new
                {
                    message =
                        "Question deleted successfully"
                });
            }
            catch (Exception ex)
            {
                return BadRequest(new
                {
                    error = ex.Message
                });
            }
        }
    }
}
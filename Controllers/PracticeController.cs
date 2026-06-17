using Microsoft.AspNetCore.Mvc;
using QuestionBankAssistant.data;
using System;
using System.Linq;

namespace QuestionBankAssistant.Controllers
{
    public class PracticeController : Controller
    {
        private readonly AppDbContext _context;

        public PracticeController(AppDbContext context)
        {
            _context = context;
        }

        public IActionResult Index()
        {
            var questions = _context.Questions.ToList();

if (!questions.Any())
{
    return View(null);
}

var random = new Random();

var question = questions[random.Next(questions.Count)];

return View(question);
        }
    }
}
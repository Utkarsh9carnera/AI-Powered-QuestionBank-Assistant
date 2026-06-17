using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Http;
using System.IO;
using System.Text;
using UglyToad.PdfPig;
using QuestionBankAssistant.data;

namespace QuestionBankAssistant.Controllers
{
    public class PdfController : Controller
    {
        private readonly AppDbContext _context;

        public PdfController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public IActionResult Upload()
        {
            return View();
        }

        [HttpPost]
        public async Task<IActionResult> Upload(IFormFile pdfFile)
        {
            if (pdfFile == null || pdfFile.Length == 0)
            {
                return Content("No file selected.");
            }

            // Create uploads folder if it doesn't exist
            var uploadsFolder = Path.Combine(
                Directory.GetCurrentDirectory(),
                "wwwroot",
                "uploads"
            );

            if (!Directory.Exists(uploadsFolder))
            {
                Directory.CreateDirectory(uploadsFolder);
            }

            // Save PDF
            var filePath = Path.Combine(
                uploadsFolder,
                pdfFile.FileName
            );

            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await pdfFile.CopyToAsync(stream);
            }

            // Extract text (optional, for future use)
            StringBuilder text = new StringBuilder();

            using (PdfDocument document = PdfDocument.Open(filePath))
            {
                foreach (var page in document.GetPages())
                {
                    text.AppendLine(page.Text);
                }
            }

            // For now, do not parse or save questions
            return RedirectToAction("Index", "Questions");
        }
    }
}
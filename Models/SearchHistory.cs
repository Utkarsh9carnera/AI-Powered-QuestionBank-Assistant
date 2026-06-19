using System;

namespace QuestionBankAssistant.Models
{
    public class SearchHistory
    {
        public int Id { get; set; }

        public string UserEmail { get; set; } = string.Empty;

        public string Question { get; set; } = string.Empty;

        public string Answer { get; set; } = string.Empty;

        public DateTime CreatedAt { get; set; }
            = DateTime.UtcNow;
    }
}
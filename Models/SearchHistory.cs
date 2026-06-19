using System;

namespace QuestionBankAssistant.Models
{
    public class SearchHistory
    {
        public int Id { get; set; }

        public string UserEmail { get; set; }

        public string Question { get; set; }

        public string Answer { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
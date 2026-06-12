namespace QuestionBankAssistant.Models
{
    public class Question
    {
        public int QuestionId { get; set; }

        public string QuestionText { get; set; } = string.Empty;

        public string AnswerText { get; set; } = string.Empty;

        public string Category { get; set; } = string.Empty;

        public DateTime CreatedDate { get; set; } = DateTime.Now;
    }
}
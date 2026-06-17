namespace QuestionBankAssistant.Models
{
    public class Question
    {
        public int QuestionId { get; set; }

        public string QuestionText { get; set; } = "";

        public string AnswerText { get; set; } = "";

        public DateTime CreatedDate { get; set; } = DateTime.Now;

        public string Category { get; set; } = "";
    }
}
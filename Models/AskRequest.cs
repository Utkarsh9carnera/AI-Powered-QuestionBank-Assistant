namespace QuestionBankAssistant.Models
{
    public class AskRequest
    {
        public string Question { get; set; } = "";
        public string? UserEmail { get; set; }
    }
}
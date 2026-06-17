namespace QuestionBankAssistant.Models
{
    public class QuestionEmbedding
    {
        public int Id { get; set; }

        public int QuestionId { get; set; }

        public string VectorData { get; set; } = "";

        public Question? Question { get; set; }
    }
}
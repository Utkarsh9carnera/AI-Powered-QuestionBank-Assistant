using QuestionBankAssistant.Models;

namespace QuestionBankAssistant.Services
{
    public class VectorSearchService
    {
        public double CosineSimilarity(
            List<float> vectorA,
            List<float> vectorB)
        {
            double dot = 0;
            double magA = 0;
            double magB = 0;

            for (int i = 0; i < vectorA.Count; i++)
            {
                dot += vectorA[i] * vectorB[i];
                magA += vectorA[i] * vectorA[i];
                magB += vectorB[i] * vectorB[i];
            }

            return dot /
                (Math.Sqrt(magA) * Math.Sqrt(magB));
        }
    }
}
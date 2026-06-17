using Newtonsoft.Json;
using System.Text;

namespace QuestionBankAssistant.Services
{
    public class EmbeddingService
    {
        private readonly HttpClient _httpClient;

        public EmbeddingService()
        {
            _httpClient = new HttpClient();
        }

        public async Task<List<float>> GenerateEmbedding(string text)
        {
            var requestBody = new
            {
                model = "nomic-embed-text",
                input = text
            };

            var json = JsonConvert.SerializeObject(requestBody);

            var response = await _httpClient.PostAsync(
                "http://localhost:11434/api/embed",
                new StringContent(json, Encoding.UTF8, "application/json"));

            var result = await response.Content.ReadAsStringAsync();

            dynamic data = JsonConvert.DeserializeObject(result);

            var embedding = new List<float>();

            foreach (var item in data.embeddings[0])
            {
                embedding.Add((float)item);
            }

            return embedding;
        }
    }
}
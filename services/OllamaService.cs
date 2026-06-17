using Newtonsoft.Json;
using System.Text;

namespace QuestionBankAssistant.Services
{
    public class OllamaService
    {
        private readonly HttpClient _httpClient;

        public OllamaService()
        {
            _httpClient = new HttpClient();

            // Increase timeout
            _httpClient.Timeout = TimeSpan.FromMinutes(5);
        }

        public async Task<string> AskAI(string prompt)
        {
            try
            {
                var requestBody = new
                {
                    model = "llama3.2",
                    prompt = prompt,
                    stream = false
                };

                var json =
                    JsonConvert.SerializeObject(requestBody);

                var response =
                    await _httpClient.PostAsync(
                        "http://localhost:11434/api/generate",
                        new StringContent(
                            json,
                            Encoding.UTF8,
                            "application/json"));

                var result =
                    await response.Content.ReadAsStringAsync();

                Console.WriteLine(result);

                if (!response.IsSuccessStatusCode)
                {
                    return $"Ollama Error: {result}";
                }

                dynamic? data =
                    JsonConvert.DeserializeObject(result);

                return data?.response?.ToString()
                    ?? "No response received.";
            }
            catch (Exception ex)
            {
                return $"Exception: {ex.Message}";
            }
        }
    }
}
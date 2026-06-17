using Newtonsoft.Json;
using System.Text;

namespace QuestionBankAssistant.Services
{
    public class GroqService
    {
        private readonly HttpClient _httpClient;
        private readonly string _apiKey;

        public GroqService(IConfiguration configuration)
        {
            _httpClient = new HttpClient();
            _apiKey = configuration["GroqApiKey"] ?? "";
        }

        public async Task<string> AskAI(string prompt)
        {
            try
            {
                _httpClient.DefaultRequestHeaders.Clear();

                _httpClient.DefaultRequestHeaders.Add(
                    "Authorization",
                    $"Bearer {_apiKey}");

                var requestBody = new
                {
                    model = "llama-3.1-8b-instant",
                    messages = new[]
                    {
                        new
                        {
                            role = "user",
                            content = prompt
                        }
                    }
                };

                var json = JsonConvert.SerializeObject(requestBody);

                var response = await _httpClient.PostAsync(
                    "https://api.groq.com/openai/v1/chat/completions",
                    new StringContent(
                        json,
                        Encoding.UTF8,
                        "application/json"));

                var result = await response.Content.ReadAsStringAsync();

                Console.WriteLine("===== GROQ RESPONSE =====");
                Console.WriteLine(result);

                if (!response.IsSuccessStatusCode)
                {
                    return $"Groq API Error: {result}";
                }

                dynamic? data = JsonConvert.DeserializeObject(result);

                if (data == null)
                {
                    return "Groq returned null response";
                }

                if (data.choices == null)
                {
                    return $"Invalid Groq Response: {result}";
                }

                return data.choices[0].message.content.ToString();
            }
            catch (Exception ex)
            {
                return $"Groq Exception: {ex.Message}";
            }
        }
    }
}
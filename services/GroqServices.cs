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

        public async Task<string> AskAI(string question)
        {
            try
            {
                _httpClient.DefaultRequestHeaders.Clear();

                _httpClient.DefaultRequestHeaders.Add(
                    "Authorization",
                    $"Bearer {_apiKey}");

                var enhancedPrompt = $@"
Answer the following question in a clean and professional format.

Rules:
- Use short paragraphs.
- Use headings when appropriate.
- Use numbered points for lists.
- Avoid markdown symbols like ** or ##.
- Keep the answer readable and well structured.
- Maximum 300 words.

Question:
{question}
";

                var requestBody = new
                {
                    model = "llama-3.1-8b-instant",
                    messages = new[]
                    {
                        new
                        {
                            role = "user",
                            content = enhancedPrompt
                        }
                    },
                    temperature = 0.7
                };

                var json =
                    JsonConvert.SerializeObject(requestBody);

                var response =
                    await _httpClient.PostAsync(
                        "https://api.groq.com/openai/v1/chat/completions",
                        new StringContent(
                            json,
                            Encoding.UTF8,
                            "application/json"));

                var result =
                    await response.Content.ReadAsStringAsync();

                Console.WriteLine("===== GROQ RESPONSE =====");
                Console.WriteLine(result);

                if (!response.IsSuccessStatusCode)
                {
                    return $"Groq API Error: {result}";
                }

                dynamic? data =
                    JsonConvert.DeserializeObject(result);

                if (data == null)
                {
                    return "Groq returned null response";
                }

                if (data.choices == null)
                {
                    return $"Invalid Groq Response: {result}";
                }

                string answer =
                    data.choices[0].message.content.ToString();

                // Cleanup formatting
                answer = answer
                    .Replace("**", "")
                    .Replace("#", "")
                    .Replace("•", "• ")
                    .Trim();

                return answer;
            }
            catch (Exception ex)
            {
                return $"Groq Exception: {ex.Message}";
            }
        }
    }
}
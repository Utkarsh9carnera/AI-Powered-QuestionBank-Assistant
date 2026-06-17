using Newtonsoft.Json;
using Microsoft.Extensions.Configuration;
using System.Text;

namespace QuestionBankAssistant.Services
{
    public class GeminiService
    {
        private readonly string _apiKey;
        private readonly HttpClient _httpClient;

        public GeminiService(IConfiguration configuration)
        {
            _apiKey = configuration["GeminiApiKey"]!;
            _httpClient = new HttpClient();
        }

        public async Task<string> AskAI(string prompt)
        {
            var url =
                $"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key={_apiKey}";

            var requestBody = new
            {
                contents = new[]
                {
                    new
                    {
                        parts = new[]
                        {
                            new
                            {
                                text = prompt
                            }
                        }
                    }
                }
            };

            var json =
                JsonConvert.SerializeObject(requestBody);

            var response =
                await _httpClient.PostAsync(
                    url,
                    new StringContent(
                        json,
                        Encoding.UTF8,
                        "application/json"));

            if (!response.IsSuccessStatusCode)
            {
                var error =
                    await response.Content.ReadAsStringAsync();

                return $"Gemini Error: {error}";
            }

            var result =
                await response.Content.ReadAsStringAsync();

            Console.WriteLine(result);

            dynamic data =
                JsonConvert.DeserializeObject(result)!;

            return data.candidates[0]
                .content.parts[0]
                .text.ToString();
        }
    }
}
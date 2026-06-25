using Microsoft.EntityFrameworkCore;
using Microsoft.OpenApi.Models;
using QuestionBankAssistant.data;
using QuestionBankAssistant.Models;
using QuestionBankAssistant.Services;

var builder = WebApplication.CreateBuilder(args);

// MVC
builder.Services.AddControllersWithViews();

// Swagger
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(options =>
{
    options.SwaggerDoc("v1", new OpenApiInfo
    {
        Title = "Question Bank Assistant API",
        Version = "v1",
        Description = "AI-powered Question Bank Assistant using RAG, ASP.NET Core, SQLite and Groq.",
        Contact = new OpenApiContact
        {
            Name = "Utkarsh Krishna Tripathi"
        }
    });
});

// Database
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlite(
        builder.Configuration.GetConnectionString("DefaultConnection")));

// AI Services
builder.Services.AddSingleton<GroqService>();
builder.Services.AddSingleton<EmbeddingService>();
builder.Services.AddSingleton<VectorSearchService>();

// React CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("ReactPolicy", policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

var app = builder.Build();

// Swagger (Enabled in all environments)
app.UseSwagger();
app.UseSwaggerUI(options =>
{
    options.SwaggerEndpoint("/swagger/v1/swagger.json", "Question Bank Assistant API v1");
    options.RoutePrefix = "swagger";
});

// Create database automatically
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    db.Database.Migrate();
}

// Configure HTTP request pipeline
if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Home/Error");
    app.UseHsts();
}

app.UseHttpsRedirection();

app.UseStaticFiles();

app.UseRouting();

// Enable CORS
app.UseCors("ReactPolicy");

app.UseAuthorization();

// API Controllers
app.MapControllers();

// Seed sample data
using (var scope = app.Services.CreateScope())
{
    var context = scope.ServiceProvider.GetRequiredService<AppDbContext>();

    if (!context.Questions.Any())
    {
        context.Questions.AddRange(
            new Question
            {
                QuestionText = "What is React?",
                AnswerText = "React is a JavaScript library for building user interfaces.",
                Category = "Web Development"
            },
            new Question
            {
                QuestionText = "What is AWS?",
                AnswerText = "AWS is Amazon's cloud computing platform.",
                Category = "Cloud Computing"
            },
            new Question
            {
                QuestionText = "What is SQL?",
                AnswerText = "SQL is used to manage and query relational databases.",
                Category = "Database"
            },
            new Question
            {
                QuestionText = "What is Machine Learning?",
                AnswerText = "Machine Learning enables systems to learn from data without explicit programming.",
                Category = "Artificial Intelligence"
            },
            new Question
            {
                QuestionText = "Who is Cristiano Ronaldo?",
                AnswerText = "Cristiano Ronaldo is a Portuguese professional football player.",
                Category = "Sports"
            }
        );

        context.SaveChanges();
    }
}

// MVC Routes
app.MapControllerRoute(
    name: "default",
    pattern: "{controller=AI}/{action=Index}/{id?}");

app.Run();
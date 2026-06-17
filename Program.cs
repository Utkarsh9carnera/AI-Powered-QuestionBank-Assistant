using Microsoft.EntityFrameworkCore;
using QuestionBankAssistant.data;
using QuestionBankAssistant.Services;

var builder = WebApplication.CreateBuilder(args);

// MVC
builder.Services.AddControllersWithViews();

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
    options.AddPolicy("ReactPolicy",
        policy =>
        {
            policy.AllowAnyOrigin()
                  .AllowAnyHeader()
                  .AllowAnyMethod();
        });
});

var app = builder.Build();

// Enable CORS
app.UseCors("ReactPolicy");

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

app.UseAuthorization();

// API Controllers
app.MapControllers();

// MVC Routes
app.MapControllerRoute(
    name: "default",
    pattern: "{controller=AI}/{action=Index}/{id?}");

app.Run();
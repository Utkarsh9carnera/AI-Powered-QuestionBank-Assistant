using Microsoft.EntityFrameworkCore;
using QuestionBankAssistant.Models;

namespace QuestionBankAssistant.data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options)
            : base(options)
        {
        }

        public DbSet<Question> Questions { get; set; }
    }
}
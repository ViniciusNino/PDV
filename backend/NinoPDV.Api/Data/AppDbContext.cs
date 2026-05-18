using Microsoft.EntityFrameworkCore;
using NinoPDV.Api.Models;

namespace NinoPDV.Api.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        {
        }

        public DbSet<Category> Categories { get; set; }
        public DbSet<Product> Products { get; set; }
        public DbSet<Sale> Sales { get; set; }
        public DbSet<SaleItem> SaleItems { get; set; }
        public DbSet<User> Users { get; set; }
        public DbSet<Company> Companies { get; set; }
        public DbSet<PrintSetting> PrintSettings { get; set; }
        public DbSet<SystemSetting> SystemSettings { get; set; }
        public DbSet<EmailSetting> EmailSettings { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Sale -> SaleItem Relationship
            modelBuilder.Entity<Sale>()
                .HasMany(s => s.Items)
                .WithOne(i => i.Sale)
                .HasForeignKey(i => i.SaleId);

            // Product -> Category Relationship
            modelBuilder.Entity<Product>()
                .HasOne(p => p.Category)
                .WithMany(c => c.Products)
                .HasForeignKey(p => p.CategoryId);

            // Company -> PrintSetting Relationship (1-to-1)
            modelBuilder.Entity<Company>()
                .HasOne(c => c.PrintSetting)
                .WithOne(p => p.Company)
                .HasForeignKey<PrintSetting>(p => p.CompanyId)
                .OnDelete(DeleteBehavior.Cascade);

            // Company -> SystemSetting Relationship (1-to-1)
            modelBuilder.Entity<Company>()
                .HasOne(c => c.SystemSetting)
                .WithOne(s => s.Company)
                .HasForeignKey<SystemSetting>(s => s.CompanyId)
                .OnDelete(DeleteBehavior.Cascade);

            // Company -> EmailSetting Relationship (1-to-1)
            modelBuilder.Entity<Company>()
                .HasOne(c => c.EmailSetting)
                .WithOne(e => e.Company)
                .HasForeignKey<EmailSetting>(e => e.CompanyId)
                .OnDelete(DeleteBehavior.Cascade);
        }

        public override int SaveChanges()
        {
            UpdateSyncFields();
            return base.SaveChanges();
        }

        public override Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
        {
            UpdateSyncFields();
            return base.SaveChangesAsync(cancellationToken);
        }

        private void UpdateSyncFields()
        {
            var entries = ChangeTracker.Entries<BaseEntity>();

            foreach (var entry in entries)
            {
                if (entry.State == EntityState.Added || entry.State == EntityState.Modified)
                {
                    entry.Entity.UpdatedAt = DateTime.UtcNow;
                    // Reset IsSynced when modified locally
                    entry.Entity.IsSynced = false;
                    entry.Entity.Version++;
                }
            }
        }
    }
}

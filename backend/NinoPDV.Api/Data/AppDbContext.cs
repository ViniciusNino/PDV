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
        
        public DbSet<ProductPrice> ProductPrices { get; set; }
        public DbSet<ProductComposition> ProductCompositions { get; set; }
        public DbSet<ProductCombo> ProductCombos { get; set; }
        public DbSet<ModifierGroup> ModifierGroups { get; set; }
        public DbSet<ModifierOption> ModifierOptions { get; set; }
        public DbSet<StockSector> StockSectors { get; set; }
        public DbSet<ProductPromotion> ProductPromotions { get; set; }

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

            // Category -> SubCategory Relationship (Hierarchy)
            modelBuilder.Entity<Category>()
                .HasOne(c => c.ParentCategory)
                .WithMany(c => c.SubCategories)
                .HasForeignKey(c => c.ParentCategoryId)
                .OnDelete(DeleteBehavior.Restrict);

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

            // Product -> ProductPrice
            modelBuilder.Entity<ProductPrice>()
                .HasOne(pp => pp.Product)
                .WithMany(p => p.Prices)
                .HasForeignKey(pp => pp.ProductId)
                .OnDelete(DeleteBehavior.Cascade);

            // ProductComposition
            modelBuilder.Entity<ProductComposition>()
                .HasOne(pc => pc.ParentProduct)
                .WithMany(p => p.Ingredients)
                .HasForeignKey(pc => pc.ParentProductId)
                .OnDelete(DeleteBehavior.Cascade);
            
            modelBuilder.Entity<ProductComposition>()
                .HasOne(pc => pc.IngredientProduct)
                .WithMany()
                .HasForeignKey(pc => pc.IngredientProductId)
                .OnDelete(DeleteBehavior.Restrict);

            // ProductCombo
            modelBuilder.Entity<ProductCombo>()
                .HasOne(pc => pc.ParentCombo)
                .WithMany(p => p.ComboItems)
                .HasForeignKey(pc => pc.ParentComboId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<ProductCombo>()
                .HasOne(pc => pc.ChildProduct)
                .WithMany()
                .HasForeignKey(pc => pc.ChildProductId)
                .OnDelete(DeleteBehavior.Restrict);

            // ModifierGroup -> Product
            modelBuilder.Entity<ModifierGroup>()
                .HasOne(mg => mg.Product)
                .WithMany(p => p.ModifierGroups)
                .HasForeignKey(mg => mg.ProductId)
                .OnDelete(DeleteBehavior.Cascade);

            // ModifierOption -> ModifierGroup
            modelBuilder.Entity<ModifierOption>()
                .HasOne(mo => mo.ModifierGroup)
                .WithMany(mg => mg.Options)
                .HasForeignKey(mo => mo.ModifierGroupId)
                .OnDelete(DeleteBehavior.Cascade);

            // ModifierOption -> Product (Item linkado ao opcional)
            modelBuilder.Entity<ModifierOption>()
                .HasOne(mo => mo.Product)
                .WithMany()
                .HasForeignKey(mo => mo.ProductId)
                .OnDelete(DeleteBehavior.Restrict);

            // ModifierOption -> ModifierOption (Associação reflexiva para etapas anteriores)
            modelBuilder.Entity<ModifierOption>()
                .HasOne(mo => mo.ParentOption)
                .WithMany()
                .HasForeignKey(mo => mo.ParentOptionId)
                .OnDelete(DeleteBehavior.Restrict);

            // Product -> StockSector (1-para-muitos, opcional)
            modelBuilder.Entity<Product>()
                .HasOne(p => p.StockSector)
                .WithMany()
                .HasForeignKey(p => p.StockSectorId)
                .OnDelete(DeleteBehavior.SetNull);

            // Product -> ProductPromotion (1-para-muitos, cascata)
            modelBuilder.Entity<ProductPromotion>()
                .HasOne(pp => pp.Product)
                .WithMany(p => p.Promotions)
                .HasForeignKey(pp => pp.ProductId)
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

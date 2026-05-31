using AshuraForge.API.Models;
using Microsoft.EntityFrameworkCore;

namespace AshuraForge.API.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    public DbSet<User> Users => Set<User>();
    public DbSet<Workout> Workouts => Set<Workout>();
    public DbSet<Badge> Badges => Set<Badge>();
    public DbSet<UserBadge> UserBadges => Set<UserBadge>();
    public DbSet<Notification> Notifications => Set<Notification>();
    public DbSet<UserProgress> UserProgresses => Set<UserProgress>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // ── User ────────────────────────────────────────────────────────────
        modelBuilder.Entity<User>(entity =>
        {
            entity.HasKey(u => u.Id);
            entity.HasIndex(u => u.Email).IsUnique();
            entity.HasIndex(u => u.Username).IsUnique();
            entity.Property(u => u.Email).HasMaxLength(200);
            entity.Property(u => u.Username).HasMaxLength(50);
        });

        // ── Workout ─────────────────────────────────────────────────────────
        modelBuilder.Entity<Workout>(entity =>
        {
            entity.HasKey(w => w.Id);
            entity.HasOne(w => w.User)
                  .WithMany(u => u.Workouts)
                  .HasForeignKey(w => w.UserId)
                  .OnDelete(DeleteBehavior.Cascade);
        });

        // ── UserBadge (composite PK) ─────────────────────────────────────────
        modelBuilder.Entity<UserBadge>(entity =>
        {
            entity.HasKey(ub => new { ub.UserId, ub.BadgeId });
            entity.HasOne(ub => ub.User)
                  .WithMany(u => u.UserBadges)
                  .HasForeignKey(ub => ub.UserId)
                  .OnDelete(DeleteBehavior.Cascade);
            entity.HasOne(ub => ub.Badge)
                  .WithMany(b => b.UserBadges)
                  .HasForeignKey(ub => ub.BadgeId)
                  .OnDelete(DeleteBehavior.Cascade);
        });

        // ── Notification ─────────────────────────────────────────────────────
        modelBuilder.Entity<Notification>(entity =>
        {
            entity.HasKey(n => n.Id);
            entity.HasOne(n => n.User)
                  .WithMany(u => u.Notifications)
                  .HasForeignKey(n => n.UserId)
                  .OnDelete(DeleteBehavior.Cascade);
        });

        // ── UserProgress ─────────────────────────────────────────────────────
        modelBuilder.Entity<UserProgress>(entity =>
        {
            entity.HasKey(p => p.Id);
            entity.HasOne(p => p.User)
                  .WithMany(u => u.ProgressRecords)
                  .HasForeignKey(p => p.UserId)
                  .OnDelete(DeleteBehavior.Cascade);
        });

        // ── Seed Badges ──────────────────────────────────────────────────────
        modelBuilder.Entity<Badge>().HasData(
            new Badge { Id = 1, Name = "İlk Adım",         Description = "İlk antrenmanını tamamladın!",             Icon = "🏃", RequiredWorkouts = 1  },
            new Badge { Id = 2, Name = "Isınma",           Description = "5 antrenman tamamladın.",                  Icon = "🔥", RequiredWorkouts = 5  },
            new Badge { Id = 3, Name = "Demir İrade",      Description = "15 antrenman tamamladın.",                 Icon = "💪", RequiredWorkouts = 15 },
            new Badge { Id = 4, Name = "Kesintisiz Güç",   Description = "30 antrenman tamamladın.",                 Icon = "⚡", RequiredWorkouts = 30 },
            new Badge { Id = 5, Name = "Savaşçı Ruhu",     Description = "50 antrenman tamamladın.",                 Icon = "⚔️", RequiredWorkouts = 50 },
            new Badge { Id = 6, Name = "Efsane",           Description = "100 antrenman tamamladın. Gerçek bir efsanesin!", Icon = "👑", RequiredWorkouts = 100 }
        );
    }
}

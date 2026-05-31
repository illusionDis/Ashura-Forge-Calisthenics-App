namespace AshuraForge.API.Models;
// ─────────────────────────────────────────────────────────────────────────────
// TITLE LEVELS (Gereksinim 9)
// ─────────────────────────────────────────────────────────────────────────────
public static class TitleLevels
{
    public static readonly List<(int MinWorkouts, string Title)> Levels = new()
    {
        (0,   "Acemi Savaşçı"),
        (5,   "Bronz Savaşçı"),
        (15,  "Gümüş Savaşçı"),
        (30,  "Altın Savaşçı"),
        (50,  "Platin Savaşçı"),
        (75,  "Elmas Savaşçı"),
        (100, "Efsane Savaşçı")
    };

    public static string GetTitle(int totalWorkouts)
    {
        string current = "Acemi Savaşçı";
        foreach (var (min, title) in Levels)
        {
            if (totalWorkouts >= min) current = title;
            else break;
        }
        return current;
    }
}
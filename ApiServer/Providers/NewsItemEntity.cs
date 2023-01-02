namespace ApiServer.Providers;

public class NewsItemEntity
{
    public int Id { get; set; }
    public string Header { get; set; } = string.Empty;
    public string NewsText { get; set; } = string.Empty;
    public string Author { get; set; } = string.Empty;
    public string NewsGroup { get; set; } = string.Empty;
}

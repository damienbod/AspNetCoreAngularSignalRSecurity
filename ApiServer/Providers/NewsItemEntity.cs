namespace ApiServer.Providers
{
    public class NewsItemEntity
    {
        public long Id { get; set; }
        public string Header { get; set; }
        public string NewsText { get; set; }
        public string Author { get; set; }
        public string NewsGroup { get; set; }
    }
}

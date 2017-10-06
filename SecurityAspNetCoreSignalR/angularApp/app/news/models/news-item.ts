export class NewsItem {
    public Header: string;
    public NewsText: string;
    public Author: string;
    public NewsGroup: string;

    constructor() {
    }

    AddData(header: string, newsText: string, author: string, newsGroup: string) {
        this.Header = header;
        this.NewsText = newsText;
        this.Author = author;
        this.NewsGroup = newsGroup;
    }
}

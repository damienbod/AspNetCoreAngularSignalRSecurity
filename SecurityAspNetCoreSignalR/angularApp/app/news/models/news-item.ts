export class NewsItem {
    public header: string;
    public newsText: string;
    public author: string;
    public newsGroup: string;

    constructor() {
    }

    AddData(header: string, newsText: string, author: string, newsGroup: string) {
        this.header = header;
        this.newsText = newsText;
        this.author = author;
        this.newsGroup = newsGroup;
    }
}

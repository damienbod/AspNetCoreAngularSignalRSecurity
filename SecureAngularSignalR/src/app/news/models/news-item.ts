export class NewsItem {
  public header = '';
  public newsText = '';
  public author = '';
  public newsGroup = '';

  constructor() {}

  AddData(header: string, newsText: string, author: string, newsGroup: string) {
    this.header = header;
    this.newsText = newsText;
    this.author = author;
    this.newsGroup = newsGroup;
  }
}

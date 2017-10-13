using ApiServer.Data;
using ApiServer.SignalRHubs;
using System;
using System.Collections.Generic;
using System.Linq;

namespace ApiServer.Providers
{
    public class NewsStore
    {
        public NewsStore(NewsContext newsContext)
        {
            _newsContext = newsContext;
        }

        private readonly NewsContext _newsContext;

        public void AddGroup(string group)
        {
            _newsContext.NewsGroups.Add(new NewsGroup
            {
                Name = group
            });
            _newsContext.SaveChanges();
        }

        public bool GroupExists(string group)
        {
            var item = _newsContext.NewsGroups.FirstOrDefault(t => t.Name == group);
            if(item == null)
            {
                return false;
            }

            return true;
        }

        public void CreateNewItem(NewsItem item)
        {
            if (GroupExists(item.NewsGroup))
            {
                _newsContext.NewsItemEntities.Add(new NewsItemEntity
                {
                    Header = item.Header,
                    Author = item.Author,
                    NewsGroup = item.NewsGroup,
                    NewsText = item.NewsText
                });
                _newsContext.SaveChanges();
            }
            else
            {
                throw new System.Exception("group does not exist");
            }
        }

        public IEnumerable<NewsItem> GetAllNewsItems(string group)
        {
            return _newsContext.NewsItemEntities.Where(item => item.NewsGroup == group).Select(z => 
                new NewsItem {
                    Author = z.Author,
                    Header = z.Header,
                    NewsGroup = z.NewsGroup,
                    NewsText = z.NewsText
                });
        }

        public List<string> GetAllGroups()
        {
            return _newsContext.NewsGroups.Select(t =>  t.Name ).ToList();
        }
    }
}

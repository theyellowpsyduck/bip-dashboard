# Twitter Scraper

Gathers all the tweets for a single day from Build in Public and stores it in json file

# How to use

```bash
pnpm install
pnpm start
```

Go to twitter, visit bip community. Open networks tab. 

Refresh the page and find the SECOND "get" request made for a file called 'CommunityTweetsTimeline'. Copy the curl request.

Send the following request to the scraper:

```bash
curl --location 'localhost:3000/tweets' \
--form 'curl="<paste curl request here without editing> "'
```


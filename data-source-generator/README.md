# Data Source Generator

This is a browser automation tool that:
- Allows a user to login to X (Twitter) and navigate to the "Build in Public" community
- Collects all tweets made in a day
- Combines tweets made by a user
- Saves users to a file, and tweets to another file

## Setup

0. Create a new virtual environment:
```bash
python3 -m venv venv
source venv/bin/activate
```

1. Install Python dependencies:
```bash
pip install -r requirements.txt
```

2. Install Playwright browsers:
```bash
playwright install
```

## Usage

Run the scraper with a Twitter URL:

```bash
python main.py <twitter_url> [max_tweets]
```

### Examples

Get tweets from a user profile:
```bash
python main.py https://twitter.com/username
```

Get tweets from a search query:
```bash
python main.py "https://twitter.com/search?q=buildinpublic" 100
```

Get tweets from a specific community or list:
```bash
python main.py https://twitter.com/i/communities/123456789
```

## How it works

1. The script opens a browser window
2. You'll be prompted to log in to Twitter manually
3. After logging in, press ENTER in the terminal to continue
4. The script navigates to the specified URL and collects tweets
5. Tweets are saved to a JSON file (e.g., `tweets_20241201_143022.json`)

## Output

The script generates a JSON file containing:
- Username and display name
- Tweet text
- Timestamp
- Tweet URL
- Scraped timestamp

Each tweet is saved as a separate entry in the JSON array.
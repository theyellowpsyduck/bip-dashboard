# BIP Dashboard Frontend

A Twitter-like feed viewer for displaying scraped Twitter posts. Built with React and Vite. Load data from any publicly accessible JSON URL.

## Features

- ⚛️ Built with React 18
- 📱 Twitter-like UI design with dark theme
- 🔗 Load data from any JSON URL (no local file dependencies)
- 🔍 Real-time search functionality
- 👤 Filter tweets by user
- 🖼️ Media support (images) with grid layout
- 📊 Tweet and user statistics
- 🎨 Styled with Tailwind CSS
- ⚡ Optimized for GitHub Pages with Vite

## Usage

1. Open the application in your browser
2. Enter the URLs for your JSON files:
   - **Posts JSON URL**: URL to the posts JSON file (e.g., `https://raw.githubusercontent.com/username/repo/main/data/posts.json`)
   - **Users JSON URL**: URL to the users JSON file (e.g., `https://raw.githubusercontent.com/username/repo/main/data/users.json`)
3. Click "Load Data" to fetch and display the tweets

### JSON Format

**Posts JSON** should be either:
- An object with username keys mapping to arrays of posts:
  ```json
  {
    "username1": [
      {
        "text": "Tweet text",
        "user": { "avatar": "...", "name": "...", "username": "..." },
        "createdAt": "2025-11-02T20:15:02.000Z",
        "url": "https://x.com/...",
        "media": ["url1", "url2"]
      }
    ]
  }
  ```
- Or an array of posts directly

**Users JSON** should be an array:
  ```json
  [
    {
      "avatar": "...",
      "name": "...",
      "username": "..."
    }
  ]
  ```

## Local Development

1. Install dependencies:
   ```bash
   cd frontend
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

3. Open your browser to the URL shown in the terminal (usually `http://localhost:5173`)

4. Enter your JSON URLs in the input fields and click "Load Data"

## GitHub Pages Deployment

### Automatic Deployment (Recommended)

The repository includes a GitHub Actions workflow (`.github/workflows/deploy-pages.yml`) that automatically builds and deploys to GitHub Pages on every push to `main`.

To enable:
1. Go to your repository Settings → Pages
2. Under "Source", select "GitHub Actions"
3. Push to `main` branch - the workflow will automatically build React and deploy
4. The site will be available at `https://[your-username].github.io/[repo-name]/frontend/`

### Manual Deployment

1. Build the project:
   ```bash
   cd frontend
   npm install
   npm run build
   ```

2. Configure the base path in `vite.config.js` to match your deployment:
   ```js
   base: '/your-repo-name/frontend/' // or '/' for root deployment
   ```

3. Deploy the `dist` folder to GitHub Pages:
   - Go to repository Settings → Pages
   - Set source to the `frontend/dist` directory

## Hosting JSON Files

To make your JSON files accessible via URL, you can:

1. **GitHub Raw URLs**: Upload your JSON files to a GitHub repository and use raw URLs:
   ```
   https://raw.githubusercontent.com/username/repo/branch/path/to/posts.json
   ```

2. **GitHub Gist**: Create a Gist and use the raw URL

3. **Any static file hosting**: Upload to any service that serves static files (Netlify, Vercel, etc.)

4. **CORS Note**: The server hosting your JSON files must allow CORS requests. Most public hosting services (GitHub, Gist, etc.) already allow this.


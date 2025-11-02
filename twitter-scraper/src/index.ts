import express, { type Request, type Response } from "express";
import multer from "multer";
import axios from "axios";
import {
  apiResponseToPosts,
  parseUrlForCursor,
  replaceCursor,
  type TwitterPost,
} from "./twitterResponse.js";
import { parseCurlToApiRequest } from "./twitterResponse.js";
import { savePostsToFile } from "./file.js";

const app = express();

// Middleware to parse multipart/ form-data
const upload = multer();
const MAX_ITERATIONS = 1000; // each iteration is 20 tweets, so each day a maximum of 20000 tweets can be scraped

const getTweets = async (url: string, headers: Record<string, string>, lastTweetDate?: string) => {
  const now = new Date();

  const dayBefore = new Date(now);
  dayBefore.setDate(dayBefore.getDate() - 1);

  const lastDate = lastTweetDate ? new Date(lastTweetDate) : dayBefore;

  let cursor = null;
  let currentDate = new Date(now);
  let iterations = 0;
  const posts: TwitterPost[] = [];

  while (iterations < MAX_ITERATIONS && currentDate > lastDate) {
    console.log("iterating", iterations, currentDate.toISOString());
    const newUrl = replaceCursor(url, cursor);
    const config = {
      method: "get",
      maxBodyLength: Infinity,
      url: newUrl,
      headers,
    };
    const response = await axios.request(config);
    const { posts: newPosts, cursor: newCursor } = apiResponseToPosts(
      response.data
    );

    if (!newPosts || newPosts.length === 0) {
      break;
    }

    currentDate = newPosts.at(-1)?.createdAt ?? currentDate;

    // wait 2 second
    await new Promise((resolve) => setTimeout(resolve, 2000));
    posts.push(...newPosts);
    iterations++;
    cursor = newCursor;
  }

  await savePostsToFile(posts);
};

app.post("/tweets", upload.none(), async (req: Request, res: Response) => {
  const { curl, lastTweetDate } = req.body;
  if (typeof curl !== "string") {
    return res.status(400).json({ error: "curl is required" });
  }

  const { url, headers } = parseCurlToApiRequest(curl);

  // const { startHalf, cursorText, endHalf } = parseUrlForCursor(url);

  getTweets(url, headers, lastTweetDate);
  return res.json({ started: true });
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});

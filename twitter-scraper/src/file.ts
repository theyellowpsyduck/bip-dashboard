import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import type { TwitterPost, TwitterUser } from "./twitterResponse.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// save posts to file
export const savePostsToFile = async (posts: TwitterPost[]): Promise<void> => {
  if (posts.length === 0) {
    console.log("No posts to save");
    return;
  }

  // Organize posts by user
  const postsByUser = new Map<string, TwitterPost[]>();
  const usersMap = new Map<string, TwitterUser>();
  
  for (const post of posts) {
    // Group by user
    const username = post.user.username;
    if (!postsByUser.has(username)) {
      postsByUser.set(username, []);
    }
    postsByUser.get(username)!.push(post);
    
    // Track unique users
    usersMap.set(username, post.user);
  }

  // Set up directory with current date
  const dataSourcesDir = path.resolve(__dirname, "../../data-sources");
  const currentDate = new Date();
  const dateFolder = currentDate.toISOString().split("T")[0]!; // Format: YYYY-MM-DD
  const dateDir = path.join(dataSourcesDir, dateFolder);
  await fs.mkdir(dateDir, { recursive: true });

  // File paths
  const usersFilepath = path.join(dateDir, "users.json");
  const postsFilepath = path.join(dateDir, "posts.json");

  // Read existing users if file exists
  let existingUsers: TwitterUser[] = [];
  try {
    const existingData = await fs.readFile(usersFilepath, "utf-8");
    const parsed = JSON.parse(existingData);
    existingUsers = Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    // File doesn't exist yet, that's okay
  }

  // Merge and deduplicate users by username
  const allUsers = [...existingUsers, ...Array.from(usersMap.values())];
  const uniqueUsers = Array.from(
    new Map(allUsers.map((user) => [user.username, user])).values()
  );

  // Sort by username
  uniqueUsers.sort((a, b) => a.username.localeCompare(b.username));

  // Save users file
  await fs.writeFile(
    usersFilepath,
    JSON.stringify(uniqueUsers, null, 2),
    "utf-8"
  );
  console.log(`Saved ${uniqueUsers.length} users to users.json`);

  // Read existing posts if file exists
  let existingPostsByUser: Record<string, Array<Omit<TwitterPost, "createdAt"> & { createdAt: string | Date }>> = {};
  try {
    const existingData = await fs.readFile(postsFilepath, "utf-8");
    const parsed = JSON.parse(existingData);
    existingPostsByUser = typeof parsed === "object" && parsed !== null ? parsed : {};
  } catch (error) {
    // File doesn't exist yet, that's okay
  }

  // Process posts for each user
  const allPostsByUser: Record<string, TwitterPost[]> = {};

  // Add existing posts
  for (const [username, existingPosts] of Object.entries(existingPostsByUser)) {
    const postsWithDates = existingPosts.map((post) => ({
      ...post,
      createdAt: typeof post.createdAt === "string" 
        ? new Date(post.createdAt) 
        : post.createdAt,
    })) as TwitterPost[];
    allPostsByUser[username] = postsWithDates;
  }

  // Add new posts
  for (const [username, newPosts] of postsByUser.entries()) {
    const existingPostsForUser = allPostsByUser[username] ?? [];
    const allPosts = [...existingPostsForUser, ...newPosts];
    
    // Deduplicate by text + createdAt
    const uniquePosts = Array.from(
      new Map(
        allPosts.map((post) => [
          `${post.text}-${post.createdAt.toISOString()}`,
          post,
        ])
      ).values()
    );

    // Sort by createdAt (newest first)
    uniquePosts.sort(
      (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
    );

    allPostsByUser[username] = uniquePosts;
  }

  // Convert Date objects to ISO strings for JSON serialization
  const postsToSave: Record<string, Array<Omit<TwitterPost, "createdAt"> & { createdAt: string }>> = {};
  for (const [username, userPosts] of Object.entries(allPostsByUser)) {
    postsToSave[username] = userPosts.map((post) => ({
      ...post,
      createdAt: post.createdAt.toISOString(),
    }));
  }

  // Save posts file
  await fs.writeFile(
    postsFilepath,
    JSON.stringify(postsToSave, null, 2),
    "utf-8"
  );
  
  const totalPosts = Object.values(postsToSave).reduce((sum, posts) => sum + posts.length, 0);
  console.log(`Saved ${totalPosts} unique posts across ${Object.keys(postsToSave).length} users to posts.json`);
};
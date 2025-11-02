import { useState, useEffect, useCallback } from "react";

const BASE_URL =
  "https://raw.githubusercontent.com/theyellowpsyduck/bip-dashboard/refs/heads/main/data-sources";

const getTodayDate = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate() - 1).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

export default function DataSourceInput({
  onDataLoad,
  onLoadingChange,
  onError,
  error,
}) {
  const [selectedDate, setSelectedDate] = useState(getTodayDate());

  const formatDateForUrl = (dateString) => {
    // Convert YYYY-MM-DD format (from date input) to the format used in URLs
    return dateString;
  };

  const generateUrls = (date) => {
    if (!date) return { postsUrl: "", usersUrl: "" };
    const formattedDate = formatDateForUrl(date);
    return {
      postsUrl: `${BASE_URL}/${formattedDate}/posts.json`,
      usersUrl: `${BASE_URL}/${formattedDate}/users.json`,
    };
  };

  const loadData = useCallback(async () => {
    if (!selectedDate) {
      onError("Please select a date");
      return;
    }

    const { postsUrl, usersUrl } = generateUrls(selectedDate);

    onLoadingChange(true);
    onError("");

    try {
      const [postsResponse, usersResponse] = await Promise.all([
        fetch(postsUrl),
        fetch(usersUrl),
      ]);

      if (!postsResponse.ok || !usersResponse.ok) {
        // Handle 404 or other errors as "data is missing"
        if (postsResponse.status === 404 || usersResponse.status === 404) {
          onError("Data is missing");
          onDataLoad([], []); // Pass empty arrays to indicate no data
          return;
        }
        throw new Error(
          `Failed to load data: ${postsResponse.status} ${postsResponse.statusText}`
        );
      }

      const postsData = await postsResponse.json();
      const usersData = await usersResponse.json();

      // Process posts data - handle both object and array formats
      let processedTweets = [];
      if (Array.isArray(postsData)) {
        processedTweets = postsData.map((post) => ({
          ...post,
          createdAt: new Date(post.createdAt),
        }));
      } else if (typeof postsData === "object") {
        processedTweets = Object.values(postsData)
          .flat()
          .map((post) => ({
            ...post,
            createdAt: new Date(post.createdAt),
          }));
      } else {
        throw new Error("Invalid posts data format");
      }

      // Sort by random
      processedTweets.sort(() => Math.random() - 0.5);

      // Process users data
      if (!Array.isArray(usersData)) {
        throw new Error("Users data must be an array");
      }

      // Check if data is empty
      if (processedTweets.length === 0) {
        onError("No tweets found for this date");
      } else {
        onError(""); // Clear error if data is loaded successfully
      }

      onDataLoad(processedTweets, usersData);
    } catch (err) {
      console.error("Error loading data:", err);
      onError(`Error loading data: ${err.message}`);
    } finally {
      onLoadingChange(false);
    }
  }, [selectedDate, onDataLoad, onLoadingChange, onError]);

  const handleDateChange = (e) => {
    setSelectedDate(e.target.value);
    onError(""); // Clear any previous errors when date changes
  };

  // Automatically load data when date changes or on mount
  useEffect(() => {
    if (selectedDate) {
      loadData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedDate]);

  return (
    <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-900/50 rounded-xl border border-gray-200 dark:border-gray-800">
      <div className="space-y-3">
        <div>
          <input
            type="date"
            id="datePicker"
            value={selectedDate}
            onChange={handleDateChange}
            className="w-full bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:border-twitter-blue text-sm text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
          />
        </div>

        <div className="text-sm text-gray-500 dark:text-gray-400 space-y-1">
          <p>
            There is a lot of noise on the build in public community on X, this
            dashboard gives everyone a fair chance to be seen.
          </p>
          <p className="font-bold text-center mt-2">
            Only one tweet per day for each user, displayed in random order.
          </p>
        </div>
      </div>
    </div>
  );
}

import { useState } from "react";
import Header from "./components/Header";
import DataSourceInput from "./components/DataSourceInput";
import Filters from "./components/Filters";
import TweetCard from "./components/TweetCard";

function App() {
  const [tweets, setTweets] = useState([]);
  const [users, setUsers] = useState([]);
  const [filteredTweets, setFilteredTweets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [dataLoaded, setDataLoaded] = useState(false);

  const handleDataLoad = (loadedTweets, loadedUsers) => {
    setTweets(loadedTweets);
    setUsers(loadedUsers);
    setFilteredTweets(loadedTweets);
    setDataLoaded(true);
  };

  const handleFilterChange = (filtered) => {
    setFilteredTweets(filtered);
  };

  return (
    <div className="bg-white dark:bg-black text-gray-900 dark:text-white min-h-screen transition-colors duration-200">
      <div className="container mx-auto max-w-2xl px-4 py-8">
        <Header />

        <DataSourceInput
          onDataLoad={handleDataLoad}
          onLoadingChange={setLoading}
          onError={setError}
          error={error}
        />

        {dataLoaded && (
          <Filters
            tweets={tweets}
            users={users}
            onFilterChange={handleFilterChange}
          />
        )}

        {loading && !dataLoaded && (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-twitter-blue"></div>
            <p className="mt-4 text-gray-600 dark:text-gray-500">
              Loading tweets...
            </p>
          </div>
        )}

        {!loading && dataLoaded && filteredTweets.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-600 dark:text-gray-500">
              {message ? message : "No tweets found for this date"}
            </p>
          </div>
        )}

        {!loading && dataLoaded && filteredTweets.length > 0 && (
          <div className="mt-4 space-y-4">
            {filteredTweets.map((tweet) => (
              <TweetCard key={tweet.id} tweet={tweet} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;

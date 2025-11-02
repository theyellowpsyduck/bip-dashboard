import { useState } from 'react'
import Header from './components/Header'
import DataSourceInput from './components/DataSourceInput'
import Filters from './components/Filters'
import TweetsFeed from './components/TweetsFeed'
import LoadingState from './components/LoadingState'
import EmptyState from './components/EmptyState'
import InitialState from './components/InitialState'

function App() {
  const [tweets, setTweets] = useState([])
  const [users, setUsers] = useState([])
  const [filteredTweets, setFilteredTweets] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [dataLoaded, setDataLoaded] = useState(false)

  const handleDataLoad = (loadedTweets, loadedUsers) => {
    setTweets(loadedTweets)
    setUsers(loadedUsers)
    setFilteredTweets(loadedTweets)
    setDataLoaded(true)
  }

  const handleFilterChange = (filtered) => {
    setFilteredTweets(filtered)
  }

  return (
    <div className="bg-black text-white min-h-screen">
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

        {loading && <LoadingState />}
        
        {!loading && !dataLoaded && <InitialState />}

        {!loading && dataLoaded && filteredTweets.length === 0 && <EmptyState />}

        {!loading && dataLoaded && filteredTweets.length > 0 && (
          <TweetsFeed tweets={filteredTweets} />
        )}
      </div>
    </div>
  )
}

export default App


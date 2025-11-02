import { useState } from 'react'

export default function DataSourceInput({ onDataLoad, onLoadingChange, onError, error }) {
  const [postsUrl, setPostsUrl] = useState('')
  const [usersUrl, setUsersUrl] = useState('')

  const isValidUrl = (string) => {
    try {
      const url = new URL(string)
      return url.protocol === 'http:' || url.protocol === 'https:'
    } catch (_) {
      return false
    }
  }

  const loadData = async () => {
    const postsUrlTrimmed = postsUrl.trim()
    const usersUrlTrimmed = usersUrl.trim()

    if (!postsUrlTrimmed || !usersUrlTrimmed) {
      onError('Please provide both Posts and Users JSON URLs')
      return
    }

    if (!isValidUrl(postsUrlTrimmed) || !isValidUrl(usersUrlTrimmed)) {
      onError('Please enter valid URLs (must start with http:// or https://)')
      return
    }

    onLoadingChange(true)
    onError('')

    try {
      const [postsResponse, usersResponse] = await Promise.all([
        fetch(postsUrlTrimmed),
        fetch(usersUrlTrimmed)
      ])

      if (!postsResponse.ok) {
        throw new Error(`Failed to load posts: ${postsResponse.status} ${postsResponse.statusText}`)
      }

      if (!usersResponse.ok) {
        throw new Error(`Failed to load users: ${usersResponse.status} ${usersResponse.statusText}`)
      }

      const postsData = await postsResponse.json()
      const usersData = await usersResponse.json()

      // Process posts data - handle both object and array formats
      let processedTweets = []
      if (Array.isArray(postsData)) {
        processedTweets = postsData.map(post => ({
          ...post,
          createdAt: new Date(post.createdAt)
        }))
      } else if (typeof postsData === 'object') {
        processedTweets = Object.values(postsData)
          .flat()
          .map(post => ({
            ...post,
            createdAt: new Date(post.createdAt)
          }))
      } else {
        throw new Error('Invalid posts data format')
      }

      // Sort by date (newest first)
      processedTweets.sort((a, b) => b.createdAt - a.createdAt)

      // Process users data
      if (!Array.isArray(usersData)) {
        throw new Error('Users data must be an array')
      }

      onDataLoad(processedTweets, usersData)
    } catch (err) {
      console.error('Error loading data:', err)
      onError(`Error loading data: ${err.message}`)
    } finally {
      onLoadingChange(false)
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      loadData()
    }
  }

  return (
    <div className="mb-6 p-4 bg-gray-900/50 rounded-xl border border-gray-800">
      <h2 className="text-lg font-semibold mb-3">Data Source</h2>
      <div className="space-y-3">
        <div>
          <label htmlFor="postsUrl" className="block text-sm text-gray-400 mb-1">
            Posts JSON URL
          </label>
          <input
            type="url"
            id="postsUrl"
            value={postsUrl}
            onChange={(e) => setPostsUrl(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="https://example.com/posts.json"
            className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:border-twitter-blue text-sm"
          />
        </div>
        <div>
          <label htmlFor="usersUrl" className="block text-sm text-gray-400 mb-1">
            Users JSON URL
          </label>
          <input
            type="url"
            id="usersUrl"
            value={usersUrl}
            onChange={(e) => setUsersUrl(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="https://example.com/users.json"
            className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:border-twitter-blue text-sm"
          />
        </div>
        <button
          onClick={loadData}
          className="w-full bg-twitter-blue hover:bg-twitter-hover text-white font-semibold py-2 px-4 rounded-lg transition-colors"
        >
          Load Data
        </button>
        {error && (
          <p className="text-red-500 text-sm">{error}</p>
        )}
      </div>
    </div>
  )
}


import { useState, useEffect } from 'react'

export default function Filters({ tweets, users, onFilterChange }) {
  const [userSearchTerm, setUserSearchTerm] = useState('')

  useEffect(() => {
    let filtered = tweets

    if (userSearchTerm.trim()) {
      const searchLower = userSearchTerm.toLowerCase()
      filtered = tweets.filter(tweet => {
        const userName = tweet.user.name.toLowerCase()
        const userUsername = tweet.user.username.toLowerCase()
        return userName.includes(searchLower) || userUsername.includes(searchLower)
      })
    }

    onFilterChange(filtered)
  }, [userSearchTerm, tweets, onFilterChange])

  return (
    <div className="mb-6 space-y-4">
      <div className="flex gap-2">
        <input
          type="text"
          value={userSearchTerm}
          onChange={(e) => setUserSearchTerm(e.target.value)}
          placeholder="Search users by name or username..."
          className="flex-1 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-full px-4 py-2 focus:outline-none focus:border-twitter-blue text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
        />
      </div>
      <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-500">
        <span>{tweets.length} tweets</span>
        <span>{users.length} users</span>
      </div>
    </div>
  )
}


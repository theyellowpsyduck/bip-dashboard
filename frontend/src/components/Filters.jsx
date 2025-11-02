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
          className="flex-1 bg-white border border-gray-300 rounded-full px-4 py-2 focus:outline-none focus:border-twitter-blue text-gray-900 placeholder-gray-500"
        />
      </div>
      <div className="flex items-center gap-4 text-sm text-gray-600">
        <span>{tweets.length} tweets</span>
        <span>{users.length} users</span>
      </div>
    </div>
  )
}


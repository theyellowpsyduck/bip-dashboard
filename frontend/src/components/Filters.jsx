import { useState, useEffect } from 'react'

export default function Filters({ tweets, users, onFilterChange }) {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedUser, setSelectedUser] = useState('')

  useEffect(() => {
    const filtered = tweets.filter(tweet => {
      const matchesSearch = !searchTerm || 
        tweet.text.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tweet.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tweet.user.username.toLowerCase().includes(searchTerm.toLowerCase())
      
      const matchesUser = !selectedUser || tweet.user.username === selectedUser
      
      return matchesSearch && matchesUser
    })

    onFilterChange(filtered)
  }, [searchTerm, selectedUser, tweets, onFilterChange])

  const sortedUsers = [...users].sort((a, b) => a.name.localeCompare(b.name))

  return (
    <div className="mb-6 space-y-4">
      <div className="flex gap-2">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search tweets..."
          className="flex-1 bg-gray-900 border border-gray-700 rounded-full px-4 py-2 focus:outline-none focus:border-twitter-blue"
        />
        <select
          value={selectedUser}
          onChange={(e) => setSelectedUser(e.target.value)}
          className="bg-gray-900 border border-gray-700 rounded-full px-4 py-2 focus:outline-none focus:border-twitter-blue"
        >
          <option value="">All Users</option>
          {sortedUsers.map(user => (
            <option key={user.username} value={user.username}>
              {user.name} (@{user.username})
            </option>
          ))}
        </select>
      </div>
      <div className="flex items-center gap-4 text-sm text-gray-500">
        <span>{tweets.length} tweets</span>
        <span>{users.length} users</span>
      </div>
    </div>
  )
}


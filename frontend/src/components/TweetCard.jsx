import { useMemo } from 'react'

export default function TweetCard({ tweet }) {
  const formattedDate = useMemo(() => formatDate(tweet.createdAt), [tweet.createdAt])
  const formattedText = useMemo(() => formatTweetText(tweet.text), [tweet.text])

  const handleClick = () => {
    window.open(tweet.url, '_blank', 'noopener,noreferrer')
  }

  return (
    <div
      className="border-b border-gray-200 dark:border-gray-800 pb-4 hover:bg-gray-50 dark:hover:bg-gray-900/50 transition-colors cursor-pointer tweet-enter"
      onClick={handleClick}
    >
      <article className="flex gap-3 px-4 pt-3">
        {/* Avatar */}
        <div className="flex-shrink-0">
          <img
            src={tweet.user.avatar}
            alt={tweet.user.name}
            className="w-12 h-12 rounded-full object-cover"
            onError={(e) => {
              e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23999'%3E%3Cpath d='M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z'/%3E%3C/svg%3E"
            }}
          />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* Header */}
          <div className="flex items-center gap-2 mb-1">
            <span className="font-bold hover:underline cursor-pointer text-gray-900 dark:text-white">{tweet.user.name}</span>
            <span className="text-gray-600 dark:text-gray-500">@{tweet.user.username}</span>
            <span className="text-gray-600 dark:text-gray-500">·</span>
            <a
              href={tweet.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 dark:text-gray-500 hover:underline"
              onClick={(e) => e.stopPropagation()}
            >
              <time dateTime={tweet.createdAt.toISOString()}>{formattedDate}</time>
            </a>
          </div>

          {/* Text */}
          <div
            className="mb-3 text-[15px] leading-5 break-words text-gray-900 dark:text-white"
            dangerouslySetInnerHTML={{ __html: formattedText }}
          />

          {/* Media */}
          {tweet.media && tweet.media.length > 0 && (
            <div className="mb-3 rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-800">
              {tweet.media.length === 1 ? (
                <img
                  src={tweet.media[0]}
                  alt="Tweet media"
                  className="w-full h-auto max-h-[600px] object-cover"
                  loading="lazy"
                  onError={(e) => {
                    e.target.style.display = 'none'
                  }}
                />
              ) : (
                <div className="grid grid-cols-2 gap-0.5">
                  {tweet.media.slice(0, 4).map((media, idx) => (
                    <img
                      key={idx}
                      src={media}
                      alt={`Tweet media ${idx + 1}`}
                      className={`w-full h-64 object-cover ${tweet.media.length === 3 && idx === 2 ? 'col-span-2' : ''}`}
                      loading="lazy"
                      onError={(e) => {
                        e.target.style.display = 'none'
                      }}
                    />
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </article>
    </div>
  )
}

// Format date to Twitter-like format
function formatDate(date) {
  const now = new Date()
  const diff = now - date
  const seconds = Math.floor(diff / 1000)
  const minutes = Math.floor(seconds / 60)
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)

  if (seconds < 60) return 'now'
  if (minutes < 60) return `${minutes}m`
  if (hours < 24) return `${hours}h`
  if (days < 7) return `${days}d`

  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

// Format tweet text with links and mentions
function formatTweetText(text) {
  // Replace URLs with clickable links
  let formatted = text.replace(
    /(https?:\/\/[^\s]+)/g,
    '<a href="$1" target="_blank" rel="noopener noreferrer" class="text-twitter-blue hover:underline">$1</a>'
  )

  // Replace mentions
  formatted = formatted.replace(
    /@(\w+)/g,
    '<span class="text-twitter-blue hover:underline">@$1</span>'
  )

  // Replace hashtags
  formatted = formatted.replace(
    /#(\w+)/g,
    '<span class="text-twitter-blue hover:underline">#$1</span>'
  )

  // Preserve line breaks
  formatted = formatted.replace(/\n/g, '<br>')

  return formatted
}


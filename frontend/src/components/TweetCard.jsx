import { useMemo } from 'react'

export default function TweetCard({ tweet }) {
  const formattedDate = useMemo(() => formatDate(tweet.createdAt), [tweet.createdAt])
  const formattedText = useMemo(() => formatTweetText(tweet.text), [tweet.text])

  const handleClick = () => {
    window.open(tweet.url, '_blank', 'noopener,noreferrer')
  }

  return (
    <div
      className="border-b border-gray-800 pb-4 hover:bg-gray-900/50 transition-colors cursor-pointer tweet-enter"
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
            <span className="font-bold hover:underline cursor-pointer">{tweet.user.name}</span>
            <span className="text-gray-500">@{tweet.user.username}</span>
            <span className="text-gray-500">·</span>
            <a
              href={tweet.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-500 hover:underline"
              onClick={(e) => e.stopPropagation()}
            >
              <time dateTime={tweet.createdAt.toISOString()}>{formattedDate}</time>
            </a>
          </div>

          {/* Text */}
          <div
            className="mb-3 text-[15px] leading-5 break-words"
            dangerouslySetInnerHTML={{ __html: formattedText }}
          />

          {/* Media */}
          {tweet.media && tweet.media.length > 0 && (
            <div className="mb-3 rounded-2xl overflow-hidden border border-gray-800">
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

          {/* Actions */}
          <div className="flex items-center justify-between mt-3 text-gray-500">
            <button className="hover:text-twitter-blue group flex items-center gap-2 transition-colors">
              <svg className="w-5 h-5 group-hover:bg-twitter-blue/10 rounded-full p-1" fill="currentColor" viewBox="0 0 24 24">
                <path d="M1.751 10c0-4.42 3.584-8 8.005-8h4.366c4.49 0 8.129 3.64 8.129 8.13 0 2.96-1.607 5.68-4.196 7.11l-8.54 4.9a.75.75 0 01-1.122-.85l.864-2.54a.75.75 0 00-.188-.883l-1.93-1.635c-.421-.356-.574-.94-.31-1.442a7.73 7.73 0 001.204-2.905c.115-.557-.196-1.14-.783-1.314a2.28 2.28 0 00-1.383.052 7.738 7.738 0 00-1.106 2.85c-.208.832.445 1.608 1.296 1.31l2.465-.77a.75.75 0 01.884.323l2.25 3.81a.75.75 0 01-.6 1.135l-2.447.214a.75.75 0 01-.893-.953l.537-2.19a.75.75 0 00-.256-.833l-3.06-2.59a7.818 7.818 0 01-1.978-5.078z"/>
              </svg>
            </button>

            <button className="hover:text-green-500 group flex items-center gap-2 transition-colors">
              <svg className="w-5 h-5 group-hover:bg-green-500/10 rounded-full p-1" fill="currentColor" viewBox="0 0 24 24">
                <path d="M4.75 3.79l4.603 4.3-1.706 1.82L3 5.75v7.96c0 .1 0 .2.04.29.04.09.09.18.15.26.07.08.15.15.24.21.09.06.18.11.29.14.1.03.2.04.29.04h2.5l-1.5-1.5H4.5v-5.87l1.03.96.5-.46-1.28-1.19-.5.46zm15.5 0l-1.28 1.19-.5-.46-1.03.96v5.87h-1.75l-1.5 1.5h2.5c.1 0 .19-.01.29-.04.11-.03.2-.08.29-.14.09-.06.17-.13.24-.21.06-.08.11-.17.15-.26.04-.09.04-.19.04-.29V5.75l-4.747 4.16-1.706-1.82L19.25 3.79zm-13.5 9.21v2.25c0 .15.05.3.14.42.09.11.22.19.36.23.07.02.14.03.22.03h10.06c.08 0 .15-.01.22-.03.14-.04.27-.12.36-.23.09-.12.14-.27.14-.42v-2.25l-5.5-4.5-5.5 4.5zm8.75 0l-3.25-2.66-3.25 2.66h6.5z"/>
              </svg>
            </button>

            <button className="hover:text-red-500 group flex items-center gap-2 transition-colors">
              <svg className="w-5 h-5 group-hover:bg-red-500/10 rounded-full p-1" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20.884 13.19c-1.351 2.48-4.001 5.12-8.379 7.67l-.503.3-.504-.3c-4.379-2.55-7.029-5.19-8.382-7.67-1.36-2.5-1.41-4.86-.514-6.67.887-1.79 2.647-2.91 4.601-3.01 1.651-.09 3.368.56 4.798 2.01 1.429-1.45 3.146-2.1 4.796-2.01 1.954.1 3.714 1.22 4.601 3.01.896 1.81.846 4.17-.514 6.67z"/>
              </svg>
            </button>

            <button className="hover:text-twitter-blue group flex items-center gap-2 transition-colors">
              <svg className="w-5 h-5 group-hover:bg-twitter-blue/10 rounded-full p-1" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8.75 21V3h2v18h-2zM18 21V8.5h2V21h-2zM4 21l.004-10h2L6 21H4zm9.248 0v-7h2v7h-2z"/>
              </svg>
            </button>

            <button className="hover:text-twitter-blue group flex items-center gap-2 transition-colors">
              <svg className="w-5 h-5 group-hover:bg-twitter-blue/10 rounded-full p-1" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.59l5.7 5.7-1.41 1.42L12 5.41 7.71 9.7l-1.41-1.42L12 2.59zM21 15l-.02 3.51c0 1.38-1.12 2.49-2.5 2.49H5.5C4.11 21 3 19.88 3 18.5V15h2v3.5c0 .28.22.5.5.5h12.98c.28 0 .5-.22.5-.5L19 15h2zM12 18.5c-1.93 0-3.5-1.57-3.5-3.5 0-1.93 1.57-3.5 3.5-3.5 1.93 0 3.5 1.57 3.5 3.5 0 1.93-1.57 3.5-3.5 3.5zm0-5c-.83 0-1.5.67-1.5 1.5s.67 1.5 1.5 1.5 1.5-.67 1.5-1.5-.67-1.5-1.5-1.5z"/>
              </svg>
            </button>
          </div>
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


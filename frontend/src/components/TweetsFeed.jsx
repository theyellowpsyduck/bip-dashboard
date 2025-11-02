import TweetCard from './TweetCard'

export default function TweetsFeed({ tweets }) {
  return (
    <div className="space-y-4">
      {tweets.map((tweet, index) => (
        <TweetCard key={`${tweet.url}-${index}`} tweet={tweet} />
      ))}
    </div>
  )
}


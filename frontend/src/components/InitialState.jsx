export default function InitialState() {
  return (
    <div className="text-center py-12">
      <div className="inline-block mb-4">
        <svg className="w-16 h-16 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
      </div>
      <p className="text-gray-500">Enter JSON URLs above to load your Twitter feed data</p>
    </div>
  )
}


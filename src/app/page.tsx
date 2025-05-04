export const metadata = {
  title: 'PromptCraft – AI Coding Prompt Discovery & Sharing',
  description: 'Discover, share, and favorite AI coding prompts. Powered by Clerk and GibsonAI.'
}

export default function HomePage() {
  return (
    <section className="flex flex-col items-center justify-center gap-10 py-20">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold tracking-tight">PromptCraft</h1>
        <p className="text-lg text-gray-600 max-w-xl mx-auto">
          Discover, share, and favorite the best AI coding prompts. Powered by Clerk authentication and GibsonAI cloud database.
        </p>
      </div>
      <div className="flex gap-4 justify-center">
        <a href="/browse" className="px-6 py-3 rounded bg-blue-600 text-white font-semibold text-lg focus:outline-none focus:ring-2 focus:ring-blue-500" tabIndex={0} aria-label="Browse Prompts">Browse Prompts</a>
        <a href="/share" className="px-6 py-3 rounded bg-gray-100 text-gray-800 font-semibold text-lg focus:outline-none focus:ring-2 focus:ring-blue-500" tabIndex={0} aria-label="Share a Prompt">Share a Prompt</a>
      </div>
      <ul className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl w-full">
        <li className="bg-white rounded-lg shadow p-6 text-center">
          <h2 className="text-xl font-semibold mb-2">Browse</h2>
          <p className="text-gray-500">Explore a curated list of AI coding prompts, ready to use and copy.</p>
        </li>
        <li className="bg-white rounded-lg shadow p-6 text-center">
          <h2 className="text-xl font-semibold mb-2">Share</h2>
          <p className="text-gray-500">Submit your favorite prompts to help the community and get feedback.</p>
        </li>
        <li className="bg-white rounded-lg shadow p-6 text-center">
          <h2 className="text-xl font-semibold mb-2">Favorite</h2>
          <p className="text-gray-500">Sign in to favorite prompts and build your personal collection.</p>
        </li>
      </ul>
    </section>
  )
}

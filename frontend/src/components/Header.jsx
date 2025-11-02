import { REPO_URL } from "../constants";
import githubMark from "../assets/github-mark.svg";

export default function Header() {
  return (
    <header className="sticky top-0 bg-white/80 backdrop-blur-md border-b border-gray-200 py-4 mb-4 z-10">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            BIP Dashboard
          </h1>
          <p className="text-gray-600 text-xs">
            Daily snapshot of the Build in Public community of X
          </p>
        </div>
        <button
          className="p-2 rounded-lg hover:bg-gray-200 transition-colors"
          aria-label="Toggle theme"
        >
          <a href={REPO_URL} target="_blank" rel="noopener noreferrer">
            <img
              src={githubMark}
              alt="GitHub"
              className="w-6 h-6 bg-transparent"
            />
          </a>
        </button>
      </div>
    </header>
  );
}

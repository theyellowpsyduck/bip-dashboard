import { REPO_URL } from "../constants";
import { useTheme } from "../contexts/ThemeContext";
import githubMark from "../assets/github-mark.svg";

export default function Header() {
  return (
    <header className="sticky top-0 bg-white/80 dark:bg-black/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 py-4 mb-4 z-10">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            BIP Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-500 text-xs">
            Daily snapshot of the Build in Public community of X
          </p>
        </div>
        <button
          className="p-2 rounded-lg dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
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

import { useState } from 'react';
import { siteConfig } from '../config/site';

export default function Masthead() {
  const [open, setOpen] = useState(false);

  return (
    <header className="border-b border-gray-200 bg-white sticky top-0 z-50">
      <div className="max-w-5xl mx-auto px-4">
        <nav className="flex items-center justify-between h-14">
          <a href="/#about-me" className="text-lg font-semibold text-gray-900 no-underline">
            Homepage
          </a>

          {/* Desktop nav */}
          <ul className="hidden md:flex items-center gap-1 text-sm">
            {siteConfig.navigation.map((item) => (
              <li key={item.url}>
                <a
                  href={item.url}
                  className="px-3 py-1.5 rounded text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors no-underline"
                >
                  {item.title}
                </a>
              </li>
            ))}
          </ul>

          {/* Mobile toggle */}
          <button
            className="md:hidden p-2 rounded hover:bg-gray-100"
            onClick={() => setOpen(!open)}
            aria-label="Toggle menu"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {open ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </nav>

        {/* Mobile nav */}
        {open && (
          <ul className="md:hidden pb-3 border-t border-gray-100">
            {siteConfig.navigation.map((item) => (
              <li key={item.url}>
                <a
                  href={item.url}
                  className="block px-4 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 no-underline"
                  onClick={() => setOpen(false)}
                >
                  {item.title}
                </a>
              </li>
            ))}
          </ul>
        )}
      </div>
    </header>
  );
}

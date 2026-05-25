export function WorldBanner() {
  return (
    <aside className="km-world-banner" aria-label="Interactive 3D portfolio notice">
      <a
        id="world-portfolio-banner-link"
        className="km-world-banner__link"
        href="https://world.karanmahajan.ca/"
        target="_blank"
        rel="noopener noreferrer"
      >
        <span className="km-world-banner__label">Interactive world</span>
        <span className="km-world-banner__copy">
          <strong>The 3D portfolio is live.</strong>
          <span>Walk through the work, stack, and contact points.</span>
        </span>
        <span className="km-world-banner__cta">
          Open world
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M7 17L17 7" />
            <path d="M8 7h9v9" />
          </svg>
        </span>
      </a>
    </aside>
  )
}

export default function NotFound() {
  return (
    <div className="page">
      <header className="find-head">
        <div className="find-cell" style={{ "--fam": "var(--pencil)" } as React.CSSProperties}>
          <span className="cell-num">404</span>
          <span className="find-sym">?</span>
          <span className="find-fam label">Not found</span>
        </div>
        <div className="find-title">
          <h1>This element isn&apos;t on the table</h1>
          <p className="find-lead">The page you asked for doesn&apos;t exist. Everything I&apos;ve built is on the home page.</p>
          <p className="hero-links">
            <a className="btn-mono" href="/#work">
              Back to the table
            </a>
          </p>
        </div>
      </header>
    </div>
  );
}

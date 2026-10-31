const LINKS = [
  { label: "Résumé", href: "/Sumedh_Kothari_Resume.pdf" },
  { label: "GitHub", href: "https://github.com/sumedhk0" },
  { label: "LinkedIn", href: "https://linkedin.com/in/sumedh-kothari" },
];

export function Hero() {
  return (
    <header className="hero">
      <p className="label hero-eyebrow">Research notebook · ML for polymers and materials</p>
      <h1 className="hero-name">Sumedh Kothari</h1>
      <p className="hero-lede">
        I build machine learning for chemistry: <em>fast interatomic potentials</em> for polymers,
        RL-tuned polymer language models, and adversarial tests for LLMs.
      </p>
      <p className="hero-sub">
        Georgia Tech · B.S. Chemical &amp; Biomolecular Engineering · Minors in Computer Science (AI) and
        Physics (Quantum) · 2028
      </p>
      <p className="hero-links">
        {LINKS.map((l) => (
          <a key={l.label} className="btn-mono" href={l.href} target="_blank" rel="noopener noreferrer">
            {l.label} ↗
          </a>
        ))}
        <a className="btn-mono" href="mailto:skothari67@gatech.edu">
          Email
        </a>
      </p>
    </header>
  );
}

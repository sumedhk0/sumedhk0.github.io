import { SectionHead } from "@/components/home/section-head";

export function Contact() {
  return (
    <section id="contact" className="sec">
      <SectionHead num="07" title="Contact" />
      <p className="prose-col">
        I&apos;m happy to talk about research, internships, or anything on this page. Email is fastest:{" "}
        <a href="mailto:skothari67@gatech.edu" className="select-all">
          skothari67@gatech.edu
        </a>
      </p>
      <p className="hero-links">
        <a className="btn-mono" href="https://github.com/sumedhk0" target="_blank" rel="noopener noreferrer">
          GitHub ↗
        </a>
        <a className="btn-mono" href="https://linkedin.com/in/sumedh-kothari" target="_blank" rel="noopener noreferrer">
          LinkedIn ↗
        </a>
      </p>
    </section>
  );
}

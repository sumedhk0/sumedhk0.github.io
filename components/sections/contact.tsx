import { Github, Linkedin, Mail, ArrowUpRight } from "lucide-react";
import { SectionReveal } from "@/components/motion/section-reveal";

const socials = [
  { label: "GitHub", href: "https://github.com/sumedhk0", icon: Github },
  { label: "LinkedIn", href: "https://linkedin.com/in/sumedh-kothari", icon: Linkedin },
  { label: "Email", href: "mailto:skothari67@gatech.edu", icon: Mail },
];

export function Contact() {
  return (
    <section id="contact" className="py-24">
      <div className="mx-auto max-w-5xl px-6">
        <SectionReveal>
          <p className="mb-2 font-[family-name:var(--font-geist-mono)] text-sm text-muted-foreground">
            05
          </p>
          <h2 className="mb-8 text-3xl font-bold tracking-tight">Contact</h2>
        </SectionReveal>

        <SectionReveal delay={0.05}>
          <p className="mb-8 text-muted-foreground">
            Interested in working together or have a question? Feel free to
            reach out.
          </p>

          <div className="space-y-3">
            {socials.map((social) => (
              <a
                key={social.label}
                href={social.href}
                target={social.href.startsWith("http") ? "_blank" : undefined}
                rel={
                  social.href.startsWith("http")
                    ? "noopener noreferrer"
                    : undefined
                }
                className="flex items-center gap-3 rounded-lg border border-border p-4 text-sm transition-colors hover:bg-accent"
              >
                <social.icon className="h-4 w-4 text-muted-foreground" />
                <span>{social.label}</span>
                <ArrowUpRight className="ml-auto h-3 w-3 text-muted-foreground" />
              </a>
            ))}
          </div>
        </SectionReveal>
      </div>
    </section>
  );
}

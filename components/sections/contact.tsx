"use client";

import { useState, type FormEvent } from "react";
import { Github, Linkedin, Mail, Send, ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SectionReveal } from "@/components/motion/section-reveal";

const socials = [
  { label: "GitHub", href: "https://github.com/sumedhk0", icon: Github },
  { label: "LinkedIn", href: "https://linkedin.com/in/sumedh-kothari", icon: Linkedin },
  { label: "Email", href: "mailto:skothari67@gatech.edu", icon: Mail },
];

export function Contact() {
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">(
    "idle"
  );

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus("sending");

    const form = e.currentTarget;
    const data = new FormData(form);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.get("name"),
          email: data.get("email"),
          message: data.get("message"),
        }),
      });

      if (res.ok) {
        setStatus("sent");
        form.reset();
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  };

  return (
    <section id="contact" className="py-24">
      <div className="mx-auto max-w-5xl px-6">
        <SectionReveal>
          <p className="mb-2 font-[family-name:var(--font-geist-mono)] text-sm text-muted-foreground">
            05
          </p>
          <h2 className="mb-8 text-3xl font-bold tracking-tight">Contact</h2>
        </SectionReveal>

        <div className="grid gap-12 lg:grid-cols-2">
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

          <SectionReveal delay={0.1}>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label
                  htmlFor="name"
                  className="mb-1.5 block text-sm font-medium"
                >
                  Name
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  className="w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm outline-none ring-ring transition-shadow focus:ring-2"
                  placeholder="Your name"
                />
              </div>
              <div>
                <label
                  htmlFor="email"
                  className="mb-1.5 block text-sm font-medium"
                >
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  className="w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm outline-none ring-ring transition-shadow focus:ring-2"
                  placeholder="your@email.com"
                />
              </div>
              <div>
                <label
                  htmlFor="message"
                  className="mb-1.5 block text-sm font-medium"
                >
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  required
                  rows={4}
                  className="w-full resize-none rounded-lg border border-input bg-background px-4 py-2.5 text-sm outline-none ring-ring transition-shadow focus:ring-2"
                  placeholder="Your message..."
                />
              </div>

              <Button
                type="submit"
                disabled={status === "sending"}
                className="w-full"
              >
                {status === "sending" ? (
                  "Sending..."
                ) : status === "sent" ? (
                  "Sent!"
                ) : (
                  <>
                    <Send className="mr-2 h-4 w-4" />
                    Send Message
                  </>
                )}
              </Button>

              {status === "error" && (
                <p className="text-sm text-destructive">
                  Something went wrong. Please try again.
                </p>
              )}
            </form>
          </SectionReveal>
        </div>
      </div>
    </section>
  );
}

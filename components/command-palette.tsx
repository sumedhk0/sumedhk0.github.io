"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  User,
  Briefcase,
  FolderOpen,
  FlaskConical,
  FileText,
  Mail,
  Github,
  Linkedin,
} from "lucide-react";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";

interface CommandPaletteProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onResumeOpen: () => void;
}

const icons: Record<string, React.ElementType> = {
  About: User,
  Experience: Briefcase,
  Projects: FolderOpen,
  Research: FlaskConical,
  Resume: FileText,
  Contact: Mail,
  GitHub: Github,
  LinkedIn: Linkedin,
};

const items = [
  { label: "About", href: "/#about" },
  { label: "Experience", href: "/#experience" },
  { label: "Projects", href: "/#projects" },
  { label: "Research", href: "/research" },
  { label: "Resume", href: "__resume__" },
  { label: "Contact", href: "/#contact" },
  { label: "GitHub", href: "https://github.com/sumedhk0" },
  { label: "LinkedIn", href: "https://linkedin.com/in/sumedh-kothari" },
];

export function CommandPalette({
  open,
  onOpenChange,
  onResumeOpen,
}: CommandPaletteProps) {
  const router = useRouter();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        onOpenChange(!open);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, [open, onOpenChange]);

  const handleSelect = (href: string) => {
    onOpenChange(false);
    if (href === "__resume__") {
      onResumeOpen();
      return;
    }
    if (href.startsWith("/#")) {
      const id = href.slice(2);
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
        return;
      }
    }
    router.push(href);
  };

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <CommandInput placeholder="Type a command or search..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading="Navigation">
          {items.map((item) => {
            const Icon = icons[item.label] || FolderOpen;
            return (
              <CommandItem
                key={item.label}
                onSelect={() => handleSelect(item.href)}
              >
                <Icon className="mr-2 h-4 w-4" />
                {item.label}
              </CommandItem>
            );
          })}
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}

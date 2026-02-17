"use client";

import { useState } from "react";
import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const resumes = [
  { label: "ChemE + CS", file: "/resume-cheme-cs.pdf" },
  { label: "Software", file: "/resume-software.pdf" },
];

interface ResumeModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ResumeModal({ open, onOpenChange }: ResumeModalProps) {
  const [active, setActive] = useState(0);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl h-[85vh] flex flex-col">
        <DialogHeader className="flex flex-row items-center justify-between gap-4">
          <DialogTitle>Resume</DialogTitle>
          <div className="flex items-center gap-2">
            {resumes.map((r, i) => (
              <button
                key={r.label}
                onClick={() => setActive(i)}
                className={`rounded-md px-3 py-1.5 text-xs transition-colors ${
                  active === i
                    ? "bg-foreground text-background"
                    : "bg-secondary text-secondary-foreground hover:bg-accent"
                }`}
              >
                {r.label}
              </button>
            ))}
            <Button variant="outline" size="sm" asChild>
              <a href={resumes[active].file} download>
                <Download className="mr-2 h-4 w-4" />
                Download
              </a>
            </Button>
          </div>
        </DialogHeader>
        <div className="flex-1 overflow-hidden rounded-md border border-border">
          <iframe
            key={resumes[active].file}
            src={resumes[active].file}
            className="h-full w-full"
            title={`Resume - ${resumes[active].label}`}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}

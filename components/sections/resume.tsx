"use client";

import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface ResumeModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ResumeModal({ open, onOpenChange }: ResumeModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl h-[85vh] flex flex-col">
        <DialogHeader className="flex flex-row items-center justify-between">
          <DialogTitle>Resume</DialogTitle>
          <Button variant="outline" size="sm" asChild>
            <a href="/resume.pdf" download>
              <Download className="mr-2 h-4 w-4" />
              Download
            </a>
          </Button>
        </DialogHeader>
        <div className="flex-1 overflow-hidden rounded-md border border-border">
          <iframe
            src="/resume.pdf"
            className="h-full w-full"
            title="Resume"
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}

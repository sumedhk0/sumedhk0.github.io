export interface Project {
  id: string;
  title: string;
  description: string;
  tech: string[];
  category: "Software" | "Hardware" | "Research";
  github?: string;
  live?: string;
}

export interface Experience {
  id: string;
  role: string;
  organization: string;
  period: string;
  description: string[];
}

export interface Research {
  id: string;
  title: string;
  organization: string;
  description: string;
  methods: string[];
  status: "Published" | "In Progress" | "Submitted" | "Completed";
  link?: string;
  github?: string;
}

export interface SkillCategory {
  name: string;
  skills: string[];
}

export interface Education {
  school: string;
  degree: string;
  minors: string[];
  gpa: string;
  period: string;
  coursework: string[];
  honors: string[];
}

export interface NavItem {
  label: string;
  href: string;
  external?: boolean;
}

export type { Family } from "./theme";
import type { Family } from "./theme";

export type PageKind = "full" | "restricted" | "card";

export interface ElementLink {
  label: string;
  href: string;
}

/** One cell of the periodic table of work. `start` is "YYYY-MM". */
export interface ElementRecord {
  slug: string;
  symbol: string;
  name: string;
  family: Family;
  start: string;
  kind: PageKind;
  oneLiner: string;
  tech: string[];
  links: ElementLink[];
}

export interface PlacedElement extends ElementRecord {
  number: number;
  year: number;
  col: number;
  row: number;
  href: string | null;
}

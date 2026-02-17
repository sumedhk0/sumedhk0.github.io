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
}

export interface SkillCategory {
  name: string;
  skills: string[];
}

export interface NavItem {
  label: string;
  href: string;
  external?: boolean;
}

import { Research } from "@/lib/types";

export const research: Research[] = [
  {
    id: "lignin-valorization",
    title: "Bayesian Optimization for Lignin Valorization",
    organization: "Georgia Tech Renewable Bioproducts Institute — Tong Laboratory",
    description:
      "Applied Bayesian statistical modeling to optimize lignin valorization reaction conditions. Integrated NMR, FTIR, and DFT computational modeling for structural characterization of value-added chemicals from lignin breakdown. Collaborating on manuscript for peer-reviewed publication.",
    methods: ["Bayesian Modeling", "NMR", "FTIR", "DFT", "Python", "NumPy", "Pandas"],
    status: "In Progress",
  },
  {
    id: "mof-carbon-capture",
    title: "Fluorinated MOFs for CO₂ Capture",
    organization: "Dressen Laboratory",
    description:
      "Designed and tested fluorinated Mg₂(dobpdc) metal-organic frameworks for vehicle exhaust CO₂ capture. Improved capture potential by 20% and stability by 115%. Characterized performance using TGA, NMR, and cyclic adsorption experiments. Presented at SYNOPSYS 2025.",
    methods: ["MOF Synthesis", "Fluorination", "TGA", "NMR", "Materials Science"],
    status: "Completed",
  },
  {
    id: "pfas-remediation",
    title: "Short-Chain PFAS Remediation Technologies",
    organization: "Independent Research",
    description:
      "Conducted 35-page literature review assessing chemical and economic feasibility of PFAS removal techniques for environmental remediation. Collaborated with Yale's Dr. Julianne Rolf to validate research findings. Presented at the Symposium of Rising Scholars.",
    methods: ["Environmental Chemistry", "Literature Review", "Remediation"],
    status: "Completed",
  },
  {
    id: "greengrade",
    title: "GreenGrade — Sustainability Interval Index",
    organization: "Gemini API Developer Competition",
    description:
      "Directed 20-person UCLA team to architect a fuzzy logic-driven Sustainability Interval Index calculator with scalable data integration pipelines. Developed and deployed GreenGrade (Flutter/C++), automating sustainability analytics for 175 mining firms through Gemini API.",
    methods: ["Flutter", "C++", "Gemini API", "Fuzzy Logic", "Data Pipelines"],
    status: "Completed",
    github: "https://github.com/KOL305/GreenGradeV2",
  },
  {
    id: "eutrophication-modeling",
    title: "Freshwater Ecosystem Eutrophication Modeling",
    organization: "Hydrogen Engineering Research Consortium",
    description:
      "Used MATLAB and dimensionless differential equations to model species concentrations in eutrophic freshwater ecosystems. Employed sustainability over sets calculation to determine equilibria and stability. Co-authored research paper under UCLA faculty mentorship.",
    methods: ["MATLAB", "Differential Equations", "Ecosystem Modeling", "Stability Analysis"],
    status: "Completed",
  },
];

import type { Metadata } from "next";
import { ResearchPage } from "./research-page";

export const metadata: Metadata = {
  title: "Research | Sumedh",
  description:
    "Research portfolio spanning environmental modeling, materials science, and computational chemistry.",
};

export default function Page() {
  return <ResearchPage />;
}

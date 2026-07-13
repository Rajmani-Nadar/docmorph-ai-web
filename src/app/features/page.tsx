import { SectionHeading } from "@/components/section-heading";
import { FeatureCard } from "@/components/feature-card";
import { BrainCircuit, FileSpreadsheet, ShieldCheck, Sparkles, UploadCloud } from "lucide-react";

const items = [
  {
    title: "AI Handwriting Recognition",
    description: "A structured route for future AI extraction from handwritten PDF pages.",
    icon: <BrainCircuit className="h-6 w-6" />,
  },
  {
    title: "Excel & CSV Export",
    description: "Preview your data and export polished spreadsheets for admissions and attendance workflows.",
    icon: <FileSpreadsheet className="h-6 w-6" />,
  },
  {
    title: "Secure Uploads",
    description: "Built for institutional teams that need a calm, dependable experience.",
    icon: <ShieldCheck className="h-6 w-6" />,
  },
  {
    title: "Fast Processing",
    description: "Optimized steps and loading states keep the experience smooth for large batches.",
    icon: <Sparkles className="h-6 w-6" />,
  },
  {
    title: "Drag & Drop Uploads",
    description: "A premium upload area accepts PDF files with clear file-size and format feedback.",
    icon: <UploadCloud className="h-6 w-6" />,
  },
];

export default function FeaturesPage() {
  return (
    <div className="px-6 py-20 sm:px-8 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <SectionHeading
          eyebrow="Features"
          title="Purpose-built for education teams"
          description="The app is designed to make handwritten records feel effortless to review, validate, and export."
        />
        <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {items.map((item) => (
            <FeatureCard key={item.title} title={item.title} description={item.description} icon={item.icon} />
          ))}
        </div>
      </div>
    </div>
  );
}

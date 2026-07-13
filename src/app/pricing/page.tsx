import { SectionHeading } from "@/components/section-heading";
import { CheckCircle2 } from "lucide-react";

const plans = [
  {
    name: "Starter",
    price: "$29",
    description: "For small campuses that need a simple, reliable upload workflow.",
    features: ["Up to 100 PDFs/month", "Excel export", "Email support"],
  },
  {
    name: "Campus",
    price: "$99",
    description: "For institutions handling admission and attendance volume at scale.",
    features: ["Unlimited uploads", "Priority processing", "Analytics dashboard"],
  },
  {
    name: "Enterprise",
    price: "Custom",
    description: "For multi-campus and district-level operations.",
    features: ["Dedicated onboarding", "SSO", "Custom integrations"],
  },
];

export default function PricingPage() {
  return (
    <div className="px-6 py-20 sm:px-8 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <SectionHeading
          eyebrow="Pricing"
          title="Simple pricing, premium experience"
          description="Choose the plan that matches your school or college workflow today."
          align="center"
        />
        <div className="mt-10 grid gap-6 lg:grid-cols-3">
          {plans.map((plan) => (
            <div key={plan.name} className="rounded-[2rem] border border-white/10 bg-white/5 p-8 backdrop-blur-xl">
              <p className="text-sm uppercase tracking-[0.3em] text-cyan-300">{plan.name}</p>
              <p className="mt-6 text-4xl font-semibold text-white">{plan.price}</p>
              <p className="mt-4 text-sm leading-7 text-slate-400">{plan.description}</p>
              <ul className="mt-8 space-y-3">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-3 text-sm text-slate-300">
                    <CheckCircle2 className="h-4 w-4 text-cyan-300" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

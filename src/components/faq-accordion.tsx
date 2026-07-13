"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { useState } from "react";

const faqs = [
  {
    question: "Can it read handwritten documents?",
    answer:
      "Yes. DocMorph AI is designed for handwritten attendance registers, admission forms, student records, and tabular documents with strong extraction accuracy.",
  },
  {
    question: "Does it support multi-page PDFs?",
    answer:
      "Absolutely. The workflow is optimized for both single-page and multi-page PDF documents, including long attendance registers and bulk forms.",
  },
  {
    question: "Can I edit data before download?",
    answer:
      "Yes. Every extracted row can be reviewed in the preview table, and any field can be corrected before exporting to Excel.",
  },
  {
    question: "Which Excel format is generated?",
    answer:
      "The export is generated as a polished spreadsheet ready for Excel and CSV workflows, with structured rows and columns.",
  },
];

export function FAQAccordion() {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <div className="space-y-3">
      {faqs.map((item, index) => {
        const isOpen = openIndex === index;

        return (
          <div key={item.question} className="rounded-3xl border border-white/10 bg-white/5 p-4 shadow-[0_20px_80px_rgba(6,182,212,0.08)] backdrop-blur-xl">
            <button
              type="button"
              onClick={() => setOpenIndex(isOpen ? -1 : index)}
              className="flex w-full items-center justify-between gap-3 text-left"
            >
              <span className="text-base font-semibold text-white">{item.question}</span>
              <motion.span animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.2 }} className="rounded-full border border-cyan-400/20 bg-cyan-400/10 p-2 text-cyan-300">
                <ChevronDown className="h-4 w-4" />
              </motion.span>
            </button>
            <AnimatePresence initial={false}>
              {isOpen ? (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <p className="mt-4 text-sm leading-7 text-slate-400">{item.answer}</p>
                </motion.div>
              ) : null}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}

import { motion } from "framer-motion";
import { useState } from "react";

const steps = [
  {
    id: 1,
    title: "Upload VCF File",
    desc: "Patient uploads their Variant Call Format file containing genetic data from clinical sequencing.",
    icon: "📄",
  },
  {
    id: 2,
    title: "Select Drugs",
    desc: "Choose from supported drugs: Codeine, Warfarin, Clopidogrel, Simvastatin, Azathioprine, Fluorouracil.",
    icon: "💊",
  },
  {
    id: 3,
    title: "AI Analysis",
    desc: "Our engine parses genetic variants across 6 critical pharmacogenes and cross-references CPIC guidelines.",
    icon: "🧬",
  },
  {
    id: 4,
    title: "Risk Prediction",
    desc: "Get personalized risk labels: Safe, Adjust Dosage, Toxic, or Ineffective — with confidence scores.",
    icon: "⚠️",
  },
  {
    id: 5,
    title: "Clinical Report",
    desc: "Receive detailed explanations, dosing recommendations, and downloadable JSON reports for clinical use.",
    icon: "📊",
  },
];

export default function WhatWeDoSection() {
  const [hoveredStep, setHoveredStep] = useState<number | null>(null);

  return (
    <section className="py-24 px-6 bg-pg-dark">
      <div className="max-w-5xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="font-display text-3xl md:text-5xl font-bold text-white text-center mb-4"
        >
          WHAT DO WE DO?
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="text-center text-white/60 text-lg mb-16 max-w-2xl mx-auto"
        >
          We build an AI-powered pharmacogenomic risk prediction system that turns raw genetic data into life-saving clinical insights.
        </motion.p>

        {/* Flowchart */}
        <div className="flex flex-col md:flex-row items-center justify-center gap-4">
          {steps.map((step, i) => (
            <div key={step.id} className="flex items-center">
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                onMouseEnter={() => setHoveredStep(step.id)}
                onMouseLeave={() => setHoveredStep(null)}
                className={`relative p-6 rounded-xl border transition-all duration-300 cursor-pointer w-48 text-center ${
                  hoveredStep === step.id
                    ? "border-primary bg-pg-dark-card glow-cyan scale-105"
                    : "border-border bg-pg-dark-card/50 hover:border-primary/50"
                }`}
              >
                <div className="text-3xl mb-3">{step.icon}</div>
                <h3 className="font-display text-sm font-bold text-primary mb-2">{step.title}</h3>
                <p className="text-xs text-white/60 leading-relaxed">{step.desc}</p>
              </motion.div>
              {i < steps.length - 1 && (
                <div className="hidden md:block text-primary text-2xl mx-2">→</div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

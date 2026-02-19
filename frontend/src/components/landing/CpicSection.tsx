import { motion } from "framer-motion";

export default function CpicSection() {
  return (
    <section id="cpic" className="py-24 px-6 bg-secondary">
      <div className="max-w-4xl mx-auto text-center">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="font-display text-3xl md:text-5xl font-bold text-secondary-foreground mb-8"
        >
          What's <span className="text-primary">CPIC</span>?
        </motion.h2>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="space-y-6 text-secondary-foreground/80 text-lg leading-relaxed"
        >
          <p>
            The <strong className="text-secondary-foreground">Clinical Pharmacogenomics Implementation Consortium (CPIC)</strong> is
            an international organization that creates freely available, peer-reviewed, evidence-based clinical practice guidelines
            for pairs of drugs and genes.
          </p>
          <p>
            CPIC guidelines help clinicians understand <strong className="text-secondary-foreground">how genetic variants affect drug response</strong>,
            enabling them to prescribe the right drug at the right dose for the right patient — a cornerstone of precision medicine.
          </p>
          <p>
            Their work spans critical pharmacogenes like <strong className="text-primary">CYP2D6</strong>,{" "}
            <strong className="text-primary">CYP2C19</strong>, <strong className="text-primary">CYP2C9</strong>,{" "}
            <strong className="text-primary">SLCO1B1</strong>, <strong className="text-primary">TPMT</strong>, and{" "}
            <strong className="text-primary">DPYD</strong> — the very genes PharmaGuard analyzes.
          </p>
        </motion.div>
      </div>
    </section>
  );
}

import DnaCanvas from "./DnaCanvas";
import { motion } from "framer-motion";

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <DnaCanvas />
      <div className="relative z-10 text-center max-w-3xl mx-auto px-6">
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="font-display text-4xl md:text-6xl font-bold text-white glow-text-cyan mb-6"
        >
          Adverse Drug Reactions Kill Over{" "}
          <span className="text-gradient-cyan">100,000</span> Americans Annually
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="text-lg md:text-xl text-white/80 leading-relaxed mb-8"
        >
          Many of these deaths are preventable through pharmacogenomic testing — analyzing how your genetic variants affect drug metabolism. PharmaGuard uses AI to predict personalized drug risks and save lives.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <a
            href="#cpic"
            className="inline-block px-8 py-3 rounded-lg bg-primary text-primary-foreground font-display font-semibold text-sm tracking-wider hover:bg-pg-cyan-glow transition-colors glow-cyan"
          >
            LEARN MORE ↓
          </a>
        </motion.div>
      </div>
    </section>
  );
}

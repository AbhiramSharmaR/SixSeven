const GENES = ["CYP2D6", "CYP2C19", "CYP2C9", "SLCO1B1", "TPMT", "DPYD"];

interface GeneFooterProps {
  highlightedGenes?: string[];
  onGeneClick?: (gene: string) => void;
}

export default function GeneFooter({
  highlightedGenes = [],
  onGeneClick,
}: GeneFooterProps) {
  return (
    <div className="flex justify-center gap-3 py-4 px-6 bg-pg-dark-card border-t border-border">
      {GENES.map((gene) => {
        const isHighlighted = highlightedGenes.includes(gene);
        return (
          <button
            key={gene}
            onClick={() => onGeneClick?.(gene)}
            className={`px-4 py-2 rounded-lg font-display text-xs font-bold transition-all border ${isHighlighted
                ? "bg-primary text-primary-foreground border-primary glow-cyan animate-scale-in"
                : "bg-pg-dark border-border text-white/40 hover:text-white/60"
              }`}
          >
            {gene}
          </button>
        );
      })}
    </div>
  );
}

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

const DRUGS = ["CODEINE", "WARFARIN", "CLOPIDOGREL", "SIMVASTATIN", "AZATHIOPRINE", "FLUOROURACIL"];

interface DrugSelectorProps {
  selectedDrugs: string[];
  onDrugsChange: (drugs: string[]) => void;
  onSubmit: () => void;
}

export default function DrugSelector({ selectedDrugs, onDrugsChange, onSubmit }: DrugSelectorProps) {
  const [otherDrug, setOtherDrug] = useState("");
  const [showOther, setShowOther] = useState(false);

  const toggleDrug = (drug: string) => {
    if (selectedDrugs.includes(drug)) {
      onDrugsChange(selectedDrugs.filter((d) => d !== drug));
    } else {
      onDrugsChange([...selectedDrugs, drug]);
    }
  };

  const addOther = () => {
    if (otherDrug.trim() && !selectedDrugs.includes(otherDrug.trim().toUpperCase())) {
      onDrugsChange([...selectedDrugs, otherDrug.trim().toUpperCase()]);
      setOtherDrug("");
    }
  };

  return (
    <div className="rounded-xl border border-border bg-pg-dark-card p-8 mt-6">
      <Label className="font-display text-lg font-bold text-white mb-1 block">Insert Drug</Label>
      <p className="text-white/40 text-sm mb-4">Selected: {selectedDrugs.join(", ") || "None"}</p>

      {/* Drug text display */}
      <div className="mb-4 p-3 rounded-lg bg-pg-dark border border-border min-h-[40px]">
        <span className="text-white/60 text-sm font-display">
          {selectedDrugs.length > 0 ? selectedDrugs.join(", ") : "No drugs selected..."}
        </span>
      </div>

      {/* Drug buttons */}
      <div className="flex flex-wrap gap-3 mb-4">
        {DRUGS.map((drug) => (
          <button
            key={drug}
            onClick={() => toggleDrug(drug)}
            className={`px-4 py-2 rounded-lg font-display text-xs font-semibold transition-all border ${
              selectedDrugs.includes(drug)
                ? "bg-primary text-primary-foreground border-primary glow-cyan"
                : "bg-pg-dark border-border text-white/60 hover:border-primary/50 hover:text-white"
            }`}
          >
            {drug}
          </button>
        ))}
        <button
          onClick={() => setShowOther(!showOther)}
          className={`px-4 py-2 rounded-lg font-display text-xs font-semibold transition-all border ${
            showOther
              ? "bg-primary/20 text-primary border-primary"
              : "bg-pg-dark border-border text-white/60 hover:border-primary/50"
          }`}
        >
          OTHER
        </button>
      </div>

      {/* Other input */}
      {showOther && (
        <div className="flex gap-2 mb-4">
          <Input
            value={otherDrug}
            onChange={(e) => setOtherDrug(e.target.value)}
            placeholder="Enter drug name"
            className="bg-pg-dark border-border text-white placeholder:text-white/30"
            onKeyDown={(e) => e.key === "Enter" && addOther()}
          />
          <Button onClick={addOther} size="sm" className="bg-primary text-primary-foreground font-display">Add</Button>
        </div>
      )}

      {/* Submit */}
      <Button
        onClick={onSubmit}
        disabled={selectedDrugs.length === 0}
        className="w-full bg-primary text-primary-foreground hover:bg-pg-cyan-glow font-display font-bold py-6 glow-cyan disabled:opacity-40 disabled:cursor-not-allowed"
      >
        Submit Analysis
      </Button>
    </div>
  );
}

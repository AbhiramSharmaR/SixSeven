import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import VcfUpload from "@/components/analyse/VcfUpload";
import DrugSelector from "@/components/analyse/DrugSelector";
import GeneFooter from "@/components/results/GeneFooter";
import { analysis } from "@/services/api";

const GENES = ["CYP2D6", "CYP2C19", "CYP2C9", "SLCO1B1", "TPMT", "DPYD"];

export default function Dashboard() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedDrugs, setSelectedDrugs] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("pg_token");
    if (!token) {
      navigate("/login");
    }
  }, [navigate]);

  const handleSubmit = async () => {
    if (!selectedFile || selectedDrugs.length === 0) return;

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("vcfFile", selectedFile);
      // Backend expects comma-separated string or multiple values?
      // implementation_plan says: "selectedDrugs (string or JSON list EXACTLY as backend expects)"
      // Backend analysis_routes.py:
      // if "," in selectedDrugs: drugs_list = ...
      // else: drugs_list = [selectedDrugs]
      // So comma separated string works.
      formData.append("selectedDrugs", selectedDrugs.join(","));

      await analysis.analyze(formData);

      // Fetch history to get the ID of the new analysis (since analyze response doesn't have UUID)
      const historyResponse = await analysis.getHistory();
      if (historyResponse.data && historyResponse.data.length > 0) {
        // Assuming latest is first
        const latestId = historyResponse.data[0].id;
        navigate(`/analysis/${latestId}`);
      } else {
        // Fallback if history fetch fails (unlikely)
        alert("Analysis complete but could not retrieve ID.");
      }
    } catch (error: any) {
      console.error("Analysis failed", error);
      alert(error.response?.data?.detail || "Analysis failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-pg-dark dark flex flex-col">
      <DashboardHeader />
      <main className="flex-1 max-w-3xl mx-auto w-full px-6 py-8">
        <VcfUpload onFileSelect={setSelectedFile} selectedFile={selectedFile} />
        <div className={loading ? "opacity-50 pointer-events-none" : ""}>
          <DrugSelector
            selectedDrugs={selectedDrugs}
            onDrugsChange={setSelectedDrugs}
            onSubmit={handleSubmit}
          />
        </div>
        {loading && (
          <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
            <p className="text-white font-display text-xl animate-pulse">Analyzing VCF...</p>
          </div>
        )}
      </main>
      <GeneFooter />
    </div>
  );
}

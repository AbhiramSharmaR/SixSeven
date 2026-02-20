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
      formData.append("selectedDrugs", selectedDrugs.join(","));

      const response = await analysis.analyze(formData);
      const resultData = response.data;

      // Store result in sessionStorage so AnalysisResult page can load it instantly
      const resultId = resultData.patient_id;
      sessionStorage.setItem(`analysis_${resultId}`, JSON.stringify(resultData));

      navigate(`/analysis/${resultId}`);
    } catch (error: any) {
      console.error("Analysis failed", error);
      alert(error.response?.data?.detail || "Analysis failed. Please check your file and try again.");
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

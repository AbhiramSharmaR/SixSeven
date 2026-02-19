import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import { Download, Loader2 } from "lucide-react";
import { analysis } from "@/services/api";

interface Analysis {
  id: string;
  fileName: string;
  drugs: string[];
  timestamp: string;
}

export default function Results() {
  const navigate = useNavigate();
  const [analyses, setAnalyses] = useState<Analysis[]>([]);
  const [loading, setLoading] = useState(true);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await analysis.getHistory();
        setAnalyses(response.data);
      } catch (error) {
        console.error("Failed to fetch history", error);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  const downloadJson = async (a: Analysis, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      setDownloadingId(a.id);
      const response = await analysis.getResult(a.id);

      const blob = new Blob([JSON.stringify(response.data, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `pharmaguard_${a.id}.json`;
      link.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Download failed", error);
      alert("Failed to download report");
    } finally {
      setDownloadingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-pg-dark dark flex flex-col">
      <DashboardHeader />
      <main className="flex-1 max-w-3xl mx-auto w-full px-6 py-8">
        <h2 className="font-display text-2xl font-bold text-white mb-6">Analysis Results</h2>

        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-8 h-8 text-primary animate-spin" />
          </div>
        ) : analyses.length === 0 ? (
          <div className="text-center py-20 text-white/40">
            <p className="font-display text-lg">No analyses yet</p>
            <p className="text-sm mt-2">Upload a VCF file and select drugs to get started</p>
          </div>
        ) : (
          <div className="space-y-4">
            {analyses.map((a) => (
              <div
                key={a.id}
                onClick={() => navigate(`/analysis/${a.id}`)}
                className="flex items-center justify-between p-5 rounded-xl border border-border bg-pg-dark-card hover:border-primary/50 cursor-pointer transition-all group"
              >
                <div>
                  <p className="font-display text-sm font-bold text-white group-hover:text-primary transition-colors">
                    {a.fileName}
                  </p>
                  <p className="text-white/40 text-xs mt-1">
                    {a.drugs.join(", ")} • {new Date(a.timestamp).toLocaleDateString()}
                  </p>
                </div>
                <button
                  onClick={(e) => downloadJson(a, e)}
                  disabled={downloadingId === a.id}
                  className="p-2 rounded-lg border border-border text-white/40 hover:text-primary hover:border-primary transition-colors disabled:opacity-50"
                >
                  {downloadingId === a.id ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Download className="w-4 h-4" />
                  )}
                </button>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

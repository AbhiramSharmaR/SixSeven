import { useState, useCallback } from "react";
import { Upload, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";

interface VcfUploadProps {
  onFileSelect: (file: File) => void;
  selectedFile: File | null;
}

export default function VcfUpload({ onFileSelect, selectedFile }: VcfUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file && file.name.endsWith(".vcf")) {
      onFileSelect(file);
      setShowModal(false);
    }
  }, [onFileSelect]);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onFileSelect(file);
      setShowModal(false);
    }
  };

  return (
    <>
      <div className="rounded-xl border border-border bg-pg-dark-card p-8">
        <div className="flex flex-col items-center justify-center py-12">
          <Upload className="w-12 h-12 text-primary mb-4" />
          <Button
            onClick={() => setShowModal(true)}
            className="bg-primary text-primary-foreground hover:bg-pg-cyan-glow font-display font-bold text-lg px-8 py-6 glow-cyan"
          >
            Insert VCF File
          </Button>
          {selectedFile && (
            <div className="mt-4 flex items-center gap-2 text-primary">
              <FileText className="w-4 h-4" />
              <span className="font-display text-sm">{selectedFile.name}</span>
            </div>
          )}
        </div>
      </div>

      {/* Upload Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
            onClick={() => setShowModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-pg-dark-card border border-border rounded-xl p-8 max-w-md w-full mx-4"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="font-display text-lg font-bold text-white mb-6">Upload VCF File</h3>

              <div
                onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
                className={`border-2 border-dashed rounded-xl p-12 text-center transition-colors ${
                  isDragging ? "border-primary bg-primary/10" : "border-border"
                }`}
              >
                <Upload className="w-10 h-10 text-primary mx-auto mb-4" />
                <p className="text-white/60 mb-4">Drag & drop your VCF file here</p>
                <label className="cursor-pointer">
                  <span className="text-primary hover:underline font-display text-sm">or click to browse</span>
                  <input type="file" accept=".vcf" className="hidden" onChange={handleFileInput} />
                </label>
              </div>

              <p className="text-white/30 text-xs mt-4">Supported: .vcf (Variant Call Format v4.2) • Max 5 MB</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

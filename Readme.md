# 🧬 PharmaGuard  
AI-Powered Pharmacogenomic Risk Prediction System

PharmaGuard is an intelligent precision medicine platform that analyzes patient genetic variants from VCF files and predicts drug-specific pharmacogenomic risks with explainable AI and clinical recommendations.

---

## 🌐 Live Demo

🔗 Live Application:  
https://your-live-demo-url.com  

🎥 LinkedIn Demo Video:  
https://linkedin.com/your-video-link  

📂 GitHub Repository:  
https://github.com/your-username/pharmaguard  

---

## 📌 Overview

PharmaGuard bridges the gap between genomic data and clinical decision-making.

The system:

- Parses industry-standard VCF files  
- Identifies pharmacogenomic variants  
- Predicts drug risk levels (Safe, Toxic, Adjust Dosage, Ineffective)  
- Provides CPIC-aligned clinical recommendations  
- Generates Explainable AI summaries  
- Outputs structured JSON results  

---

## 🚨 Problem Statement

Adverse drug reactions cause over 100,000 deaths annually worldwide.  
Many are preventable using pharmacogenomic analysis.

Drug metabolism varies due to variants in genes such as:

- CYP2D6  
- CYP2C19  
- CYP2C9  
- SLCO1B1  
- TPMT  
- DPYD  

There is a need for an intelligent, easy-to-use system that converts raw genetic data into actionable clinical insights.

---

## ✨ Key Features

- VCF file upload and parsing  
- Pharmacogenomic variant detection  
- Multi-drug support  
- Risk classification (Safe / Toxic / Adjust Dosage)  
- CPIC-guideline-based recommendations  
- Explainable AI clinical summary  
- Structured JSON output (hackathon compliant schema)  
- Downloadable clinical reports  
- Modern interactive dashboard  

---

## 🏗 Architecture Overview

### System Flow

User uploads VCF  
→ VCF Parser extracts variants  
→ Variant Mapping Engine identifies genes  
→ Risk Engine predicts drug safety  
→ Recommendation Engine generates advice  
→ Explainable AI module generates clinical explanation  
→ Results displayed & exported  

---

### Architecture Layers

**Frontend**
- React.js  
- Tailwind CSS  

**Backend**
- FastAPI (Python)  

**Core Modules**
- `vcf_parser.py`
- `variant_mapper.py`
- `risk_engine.py`
- `recommendation_engine.py`
- `llm_engine.py`

**Database**
- Pharmacogenomic variant mapping dataset  

---

## 🛠 Tech Stack

### Frontend
- React.js  
- Tailwind CSS  
- Axios  

### Backend
- Python  
- FastAPI  
- Pydantic  

### AI Integration
- OpenAI API (Explainable AI module)  

### Data Processing
- PyVCF / Custom parser  
- Pandas  

### Deployment
- Frontend: Vercel  
- Backend: Render / Railway  

---

## ⚙️ Installation Instructions

### Prerequisites

- Python 3.9+
- Node.js 18+
- Git

---

### Backend Setup

```bash
git clone https://github.com/your-username/pharmaguard.git
cd pharmaguard/backend
pip install -r requirements.txt
uvicorn main:app --reload

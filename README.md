# 🧬 PharmaGuard — Pharmacogenomic Risk Prediction System

> **AI-powered precision medicine: analyze patient genetic data to predict personalized drug risks and deliver clinically actionable recommendations.**


[![Python](https://img.shields.io/badge/Python-3.11+-yellow?style=for-the-badge&logo=python)](https://python.org)
[![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react)](https://react.dev)
[![RIFT 2026](https://img.shields.io/badge/RIFT%202026-Hackathon-purple?style=for-the-badge)](#)

---

## 🔗 Quick Links

| Resource | Link |
|---|---|
| 📹 LinkedIn Demo Video | [Watch on LinkedIn](https://linkedin.com/your-demo-video) |
| 📁 GitHub Repository | [github.com/your-org/PharmaGuard](https://github.com/AbhiramSharmaR/SixSeven) |

> **Built for RIFT 2026 Hackathon — Pharmacogenomics / Explainable AI Track**

---

## 📖 Overview

Adverse drug reactions (ADRs) kill over **100,000 Americans annually** — and many of these deaths are preventable. The root cause is often ignored: patients metabolize drugs differently based on their genetics. Two patients receiving the same dose of codeine can have wildly different outcomes based on their `CYP2D6` genotype.

**PharmaGuard** is a full-stack AI web application that bridges genomics and clinical decision-making. It enables clinicians and researchers to:

1. Upload a patient's **VCF (Variant Call Format)** genomic data file
2. Select one or more drugs to analyze
3. Receive a structured, explainable **pharmacogenomic risk assessment** within seconds

The system combines a trained **XGBoost machine learning classifier**, CPIC guideline-aligned logic, and a LLM-generated explanation layer to surface risk labels (`Safe`, `Adjust Dosage`, `Toxic`, `Ineffective`, `Unknown`) along with diplotype information, phenotype classification, and clinical recommendations — all presented in a dark, clinical-grade UI.

### Why It Matters

- Pharmacogenomics is the future of personalized medicine, yet adoption in clinical workflow is lagging
- VCF files are the global standard for storing genomic variants — PharmaGuard can ingest real patient data directly
- Decisions are fully explainable: every prediction cites specific genetic variants and biological mechanisms
- Results are exportable as structured JSON, compatible with EHR integration pipelines

---

## ✨ Key Features

- **VCF File Parsing** — Fully compliant parser for VCF v4.2 files, extracting `rsID`, `REF/ALT` alleles, and genotypes from standard `GT` format fields
- **Multi-Gene Coverage** — Analyzes 6 clinically critical pharmacogenes: `CYP2D6`, `CYP2C19`, `CYP2C9`, `SLCO1B1`, `TPMT`, `DPYD`
- **XGBoost Risk Classifier** — Trained on a polypharmacy pharmacogenomics dataset; predicts risk per drug with confidence scores
- **Multi-Drug Analysis** — Support for simultaneous analysis of multiple drugs (comma-separated input or multi-select UI)
- **CPIC-Aligned Recommendations** — Clinical recommendations follow Clinical Pharmacogenetics Implementation Consortium guidelines
- **Explainable AI Summaries** — LLM-generated natural language explanations citing the primary gene, phenotype, and drug impact
- **Interactive Gene Radar Charts** — Gene confidence visualized per drug result using Recharts radar charts
- **Structured JSON Output** — Results conform exactly to the required pharmacogenomic JSON schema; downloadable with one click
- **Secure Auth System** — JWT-based authentication backed by Firebase/Firestore; full signup/login/session flow
- **Analysis History** — Every analysis is persisted to Firestore and accessible from the results history page
- **Animated Clinical UI** — Dark-mode interface with Framer Motion animations, color-coded risk labels, and a toxic-risk warning banner
- **One-Click Deploy** — Single `render.yaml` for unified frontend + backend deployment to Render

---

## 🏗️ System Architecture

PharmaGuard follows a **monorepo full-stack architecture** with a React SPA frontend and a Python FastAPI backend. The frontend build artifacts are served directly by the backend in production.

```
┌────────────────────────────────────────────────────────────────┐
│                        CLIENT (Browser)                        │
│   React 18 + Vite + TypeScript + TailwindCSS + Radix UI        │
│   • VCF Upload (drag-and-drop)                                 │
│   • Drug Selector (multi-select)                               │
│   • Risk Results with Radar Chart & LLM Explanation           │
│   • Analysis History                                           │
└──────────────┬─────────────────────────────────────┬──────────┘
               │  REST API (HTTPS/JSON)               │
               ▼                                       ▼
┌────────────────────────────────┐       ┌────────────────────────┐
│     FastAPI Backend (Python)   │       │   Firebase / Firestore  │
│                                │       │   • user accounts       │
│  ┌──────────┐  ┌────────────┐ │       │   • analysis records    │
│  │ /api/    │  │ /api/      │ │       └────────────────────────┘
│  │ signup   │  │ analyze    │ │
│  │ /login   │  │ /results   │ │
│  └──────────┘  └────┬───────┘ │
│                     │         │
│          ┌──────────▼──────┐  │
│          │   VCF Parser    │  │
│          │ (vcf_parser.py) │  │
│          └──────────┬──────┘  │
│                     │         │
│          ┌──────────▼──────────────────┐
│          │   PharmacogenomicModel      │
│          │   (training_models.py)      │
│          │   • Genotype → Phenotype    │
│          │   • XGBoost predict()       │
│          │   • Risk + Explanation      │
│          └─────────────────────────────┘
│                     │         │
│          pgx_polypharmacy_xgb_model.pkl
│          pgx_label_encoder.pkl          │
└────────────────────────────────────────┘
```

### Key Module Interactions

| Module | Role |
|---|---|
| `vcf_parser.py` | Parses raw VCF bytes; extracts `rsID → genotype` dictionary |
| `training_models.py` | `PharmacogenomicModel` class: maps genotypes to phenotypes, builds feature vectors, runs XGBoost inference |
| `app/services/prediction_service.py` | Async wrapper: loops through drug list, calls `model.predict()` per drug |
| `app/services/vcf_service.py` | Async wrapper: delegates to `vcf_parser.parse_vcf()` |
| `app/routes/analysis_routes.py` | `POST /api/analyze` — orchestrates VCF parsing → prediction → Firestore save |
| `app/routes/auth_routes.py` | `POST /api/signup`, `POST /api/login` — JWT issuance backed by Firestore user store |
| `app/routes/results_routes.py` | `GET /api/results`, `GET /api/results/{id}` — history & single result retrieval |
| `app/models.py` | Pydantic v2 schemas for all request/response payloads |
| `app/auth.py` | JWT decode + `get_current_user` dependency for protected routes |
| `app/database.py` | Firebase Admin SDK initialization and Firestore client |

---

## 🛠️ Tech Stack

### Backend
| Technology | Version | Purpose |
|---|---|---|
| **Python** | 3.11+ | Core language |
| **FastAPI** | ≥0.110 | REST API framework, OpenAPI docs |
| **Uvicorn** | ≥0.27 | ASGI server |
| **XGBoost** | ≥1.7 | ML risk classifier |
| **scikit-learn** | ≥1.4 | Label encoder, dataset utilities |
| **pandas** | ≥2.2 | Feature DataFrame construction |
| **numpy** | ≥1.26 | Numeric operations |
| **Firebase Admin SDK** | ≥6.4 | Firestore database + auth |
| **python-jose** | ≥3.3 | JWT creation and verification |
| **passlib / bcrypt** | ≥1.7 | Password hashing |
| **pydantic** | ≥2.6 | Request/response schema validation |
| **python-multipart** | ≥0.0.9 | Multipart file upload parsing |

### Frontend
| Technology | Version | Purpose |
|---|---|---|
| **React** | 18.3 | UI framework |
| **TypeScript** | 5.8 | Type safety |
| **Vite** | 5.4 | Build tool and dev server |
| **TailwindCSS** | 3.4 | Utility-first CSS |
| **Radix UI** | Latest | Accessible headless component primitives |
| **Framer Motion** | 12 | Animations and transitions |
| **Recharts** | 2.15 | Radar chart for gene confidence visualization |
| **React Router DOM** | 6.30 | Client-side routing |
| **TanStack Query** | 5 | Server state management |
| **Axios** | 1.13 | HTTP client |
| **React Hook Form + Zod** | Latest | Form validation |
| **Lucide React** | 0.462 | Icon set |
| **Sonner** | 1.7 | Toast notifications |

### Infrastructure & Deployment
| Technology | Purpose |
|---|---|
| **Render** | Cloud deployment (unified frontend + backend) |
| **Firebase / Firestore** | NoSQL database for users and analysis records |
| **render.yaml** | Infrastructure-as-code for one-click deploy |

---

## 📂 Project Structure

```
SixSeven/
├── render.yaml                    # Render deployment config (IaC)
├── pgx_training_dataset.xlsx      # Training dataset reference
│
├── backend/
│   ├── main.py                    # Entrypoint (dev runner)
│   ├── requirements.txt           # Python dependencies
│   ├── .env.example               # Environment variable template
│   ├── vcf_parser.py              # Core VCF file parser
│   ├── training_models.py         # PharmacogenomicModel (XGBoost wrapper)
│   ├── pgx_polypharmacy_xgb_model.pkl  # Trained XGBoost model
│   ├── pgx_label_encoder.pkl      # Label encoder for risk classes
│   ├── pgx_full_polypharmacy_dataset.xlsx  # Extended training data
│   ├── model_features.txt         # Feature names expected by the model
│   │
│   └── app/
│       ├── main.py                # FastAPI app factory + CORS + static serving
│       ├── config.py              # Settings (pydantic-settings)
│       ├── models.py              # Pydantic schemas (request/response)
│       ├── auth.py                # JWT decode, get_current_user dependency
│       ├── database.py            # Firebase Admin + Firestore client
│       ├── firebase_config.py     # Firebase credential initialization
│       │
│       ├── routes/
│       │   ├── analysis_routes.py # POST /api/analyze
│       │   ├── auth_routes.py     # POST /api/signup, /api/login
│       │   └── results_routes.py  # GET /api/results, /api/results/{id}
│       │
│       ├── services/
│       │   ├── prediction_service.py  # Async multi-drug prediction orchestrator
│       │   └── vcf_service.py         # Async VCF parsing shim
│       │
│       └── utils/
│           └── security.py        # Password hashing + JWT token creation
│
└── frontend/
    ├── index.html                 # App shell
    ├── vite.config.ts             # Vite configuration
    ├── tailwind.config.ts         # Tailwind theme (custom colors, fonts)
    ├── package.json               # NPM dependencies
    │
    └── src/
        ├── main.tsx               # React entry point
        ├── App.tsx                # Router configuration
        ├── index.css              # Global styles + CSS variables
        │
        ├── pages/
        │   ├── Index.tsx          # Landing/splash page
        │   ├── Login.tsx          # Login form
        │   ├── Signup.tsx         # Registration form
        │   ├── Onboarding.tsx     # Post-signup onboarding
        │   ├── Dashboard.tsx      # Main analysis interface (VCF upload + drug select)
        │   ├── AnalysisResult.tsx # Full result view (radar chart, risk, explanation)
        │   ├── Results.tsx        # Analysis history list
        │   └── NotFound.tsx       # 404 fallback
        │
        ├── components/
        │   ├── analyse/           # VcfUpload, DrugSelector components
        │   ├── dashboard/         # DashboardHeader
        │   ├── landing/           # Landing page sections
        │   ├── results/           # GeneFooter component
        │   └── ui/                # Radix-based UI primitives (Button, Card, etc.)
        │
        ├── services/
        │   └── api.ts             # Axios client + auth/analysis API methods
        │
        └── hooks/                 # Custom React hooks
```

---

## ⚙️ Installation Guide

### Prerequisites

- **Python** 3.11 or higher
- **Node.js** 18 or higher (with npm)
- **Firebase project** with Firestore enabled
- A copy of the service account credentials JSON from Firebase Console

### 1. Clone the Repository

```bash
git clone https://github.com/your-org/PharmaGuard.git
cd PharmaGuard
```

### 2. Backend Setup

```bash
cd backend

# Create and activate a virtual environment
python -m venv venv

# Windows
venv\Scripts\activate

# macOS / Linux
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt
```

**Configure environment variables:**

```bash
cp .env.example .env
```

Edit `.env` with your credentials:

```env
JWT_SECRET=your_super_secret_key_change_this_in_production
JWT_ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_HOURS=24

# Path to your Firebase service account JSON (downloaded from Firebase Console)
GOOGLE_APPLICATION_CREDENTIALS=path/to/serviceAccountKey.json
```

### 3. Frontend Setup

```bash
cd frontend
npm install
```

Create `frontend/.env`:

```env
VITE_API_URL=http://localhost:8000
```

---

## 🚀 How to Run the Project

### Development Mode (Recommended for local use)

**Terminal 1 — Backend:**

```bash
cd backend
# Ensure venv is activated
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

The API will be available at `http://localhost:8000`.  
Interactive API docs: `http://localhost:8000/docs`

**Terminal 2 — Frontend:**

```bash
cd frontend
npm run dev
```

The React app will be available at `http://localhost:5173`.

### Production Mode (Render)

The `render.yaml` at the project root handles the full build and deploy pipeline on Render:

```yaml
services:
  - type: web
    name: sixseven
    env: python
    buildCommand: |
      cd frontend && npm install && npm run build
      cd ../backend && pip install -r requirements.txt
    startCommand: |
      cd backend
      export PYTHONPATH=$PYTHONPATH:.
      uvicorn app.main:app --host 0.0.0.0 --port $PORT
```

The FastAPI server serves the compiled React SPA as static files in production (via `StaticFiles` middleware and a catch-all route). **No separate frontend hosting needed.**

To deploy:

1. Fork/push this repo to GitHub
2. Create a new Web Service on [Render](https://render.com)
3. Connect your repository
4. Add environment variables in the Render dashboard
5. Render will auto-build and deploy

---

## 💡 Usage

### Workflow

1. **Sign Up / Log In** — Create an account or log in with existing credentials
2. **Upload a VCF File** — Drag and drop or click to select a `.vcf` file (up to 5 MB)
3. **Select Drugs** — Choose one or more drugs from the supported list
4. **Analyze** — Click the submit button; the system parses the VCF and runs the ML model
5. **View Results** — Results appear on the analysis page with risk labels, gene radar chart, LLM explanation, and clinical recommendation
6. **Download Report** — Click "Download Full JSON Report" to save the structured output
7. **Review History** — Previous analyses are saved and accessible from the Results page

### Supported Drugs

| Drug | Primary Gene | Mechanism |
|---|---|---|
| `CODEINE` | CYP2D6 | Opioid prodrug; PM → reduced analgesia; URM → opioid toxicity |
| `WARFARIN` | CYP2C9 | Anticoagulant; PM variants → bleeding risk |
| `CLOPIDOGREL` | CYP2C19 | Antiplatelet prodrug; PM → drug ineffectiveness |
| `SIMVASTATIN` | SLCO1B1 | Statin; SLCO1B1*5 → myopathy risk |
| `AZATHIOPRINE` | TPMT | Immunosuppressant; TPMT PM → severe myelosuppression |
| `FLUOROURACIL` | DPYD | Chemotherapy; DPYD variants → severe 5-FU toxicity |

### Example API Call

```bash
curl -X POST https://your-app.onrender.com/api/analyze \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -F "vcfFile=@sample_patient.vcf" \
  -F "selectedDrugs=CODEINE,WARFARIN"
```

---

## 📊 Example Output

The system generates the following structured JSON response (downloadable from the UI):

```json
{
  "patient_id": "PATIENT_a3f21b4c",
  "timestamp": "2026-02-19T22:35:01.123456",
  "results": [
    {
      "drug": "CODEINE",
      "risk_assessment": {
        "risk_label": "Toxic",
        "confidence_score": 0.91,
        "severity": "high"
      },
      "pharmacogenomic_profile": {
        "primary_gene": "CYP2D6",
        "diplotype": "*1/*1",
        "phenotype": "PM",
        "detected_variants": [
          { "rsid": "rs3892097", "genotype": "AA" }
        ]
      },
      "clinical_recommendation": {
        "text": "Based on the Toxic risk for CODEINE, please consult guidelines."
      },
      "llm_generated_explanation": {
        "summary": "The patient is a PM for CYP2D6, which affects CODEINE metabolism."
      },
      "quality_metrics": {
        "vcf_parsing_success": true,
        "variant_count": 12,
        "model_available": true
      }
    }
  ]
}
```

### UI Highlights

- **Color-coded risk badges**: 🟢 Safe · 🟡 Adjust Dosage · 🔴 Toxic · ⚫ Ineffective
- **Per-drug radar chart**: 6-axis Recharts radar showing gene confidence scores
- **Critical risk banner**: Animated warning for Toxic predictions
- **Animated gene chips**: Affected genes float into view on the results page
- **One-click JSON download**: Full structured report saved locally

---

## 🔬 Research / Technical Background

### Pharmacogenomics

Pharmacogenomics studies how genetic variation affects an individual's response to drugs. The cytochrome P450 enzyme family (CYP2D6, CYP2C19, CYP2C9) is responsible for metabolizing the majority of prescribed medications. Variants in these genes create distinct **metabolizer phenotypes**:

| Phenotype Code | Name | Clinical Impact |
|---|---|---|
| `PM` | Poor Metabolizer | Drug accumulates → toxicity risk |
| `IM` | Intermediate Metabolizer | Reduced clearance |
| `NM` | Normal Metabolizer | Standard dosing |
| `RM` | Rapid Metabolizer | Reduced efficacy |
| `URM` | Ultrarapid Metabolizer | Drug cleared too quickly |

### VCF Parsing

VCF (Variant Call Format) v4.2 is the industry standard for representing genomic variants. PharmaGuard's parser:
- Skips metadata header lines (starting with `#`)
- Extracts columns: `CHROM`, `POS`, `ID (rsID)`, `REF`, `ALT`, `FORMAT`, `SAMPLE`
- Decodes the `GT` (genotype) field from the `FORMAT` column
- Resolves `0/1`, `1/1`, `0|1` notation to actual nucleotide pairs (e.g., `"AC"`, `"GG"`)
- Returns a clean `{rsID: genotype}` dictionary for downstream ML inference

### Machine Learning Model

The risk classifier is an **XGBoost gradient boosted tree** trained on a polypharmacy pharmacogenomics dataset (`pgx_full_polypharmacy_dataset.xlsx`). The feature space consists of:
- **One-hot drug indicators** (e.g., `WARFARIN=1`)
- **Gene-phenotype interaction features** (e.g., `CYP2C19_PM=1`, `CYP2D6_URM=1`)

The model outputs a categorical risk label decoded via a `LabelEncoder` (`pgx_label_encoder.pkl`), alongside per-class probability scores used as confidence metrics.

### CPIC Guidelines

Clinical recommendations are aligned with the **Clinical Pharmacogenetics Implementation Consortium (CPIC)**, the gold standard for translating pharmacogenomic test results into prescribing decisions. PharmaGuard maps primary genes to drugs using CPIC's published drug-gene pairs.

---

## 🔮 Future Improvements

- **Full LLM Integration** — Wire in OpenAI / Gemini API to generate truly dynamic explanation summaries with specific rsID and mechanism citations
- **Expanded Gene Panel** — Add `VKORC1`, `G6PD`, `HLA-B`, `UGT1A1` for broader drug coverage
- **Diplotype Inference Engine** — Replace the `*1/*1` placeholder with a real star-allele calling algorithm (e.g., PyPGx or PharmVar integration)
- **File Validation** — Pre-flight VCF schema validation with line-by-line error reporting before analysis
- **FHIR API Export** — Structured HL7 FHIR R4 output for direct EHR system integration
- **Batch Processing** — Support for cohort-level analysis (multiple patients in one session)
- **Physician Dashboard** — Role-based access with analytics across patients
- **Report PDF Export** — Clinician-ready PDF reports alongside the JSON download

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature-name`
3. Commit your changes: `git commit -m 'feat: add your feature'`
4. Push to the branch: `git push origin feature/your-feature-name`
5. Open a Pull Request

Please ensure your code:
- Follows existing code style and naming conventions
- Includes docstrings for new Python functions
- Does not commit sensitive credentials or `.env` files

---

## 👥 Authors & Acknowledgements

**Team SixSeven** — RIFT 2026 Hackathon, Pharmacogenomics / Explainable AI Track

- Built with ❤️ for clinical impact and open science
- Pharmacogenomic variant logic informed by [CPIC Guidelines](https://cpicpgx.org)
- Star allele nomenclature follows [PharmVar](https://www.pharmvar.org)

> *"The right drug, the right dose, the right patient."*

---

<p align="center">
  <strong>#RIFT2026</strong> &nbsp;•&nbsp; <strong>#PharmaGuard</strong> &nbsp;•&nbsp; <strong>#Pharmacogenomics</strong> &nbsp;•&nbsp; <strong>#AIinHealthcare</strong>
</p>

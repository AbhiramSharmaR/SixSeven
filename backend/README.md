# PharmaGuard Backend

Production-ready FastAPI backend for PharmaGuard, a pharmacogenomics risk assessment platform.

## Features

- **Authentication**: JWT-based auth (Login/Signup).
- **VCF Analysis**: Parses VCF files to extract genotypes.
- **Risk Prediction**: ML-based drug-gene interaction prediction.
- **History**: Stores and retrieves past analysis results.
- **Database**: MongoDB storage.

## Setup

1.  **Environment Variables**:
    Copy `.env.example` to `.env` and update values if needed.
    ```bash
    cp .env.example .env
    ```

2.  **Install Dependencies**:
    ```bash
    pip install -r requirements.txt
    ```

3.  **Run with Uvicorn**:
    ```bash
    uvicorn app.main:app --reload
    ```

## API Endpoints

### Auth
- `POST /api/signup`: Register a new user.
- `POST /api/login`: Login and get JWT.

### Analysis
- `POST /api/analyze`: Upload VCF and get risk assessment.

### Results
- `GET /api/results`: Get analysis history.
- `GET /api/results/{id}`: Get detailed result.

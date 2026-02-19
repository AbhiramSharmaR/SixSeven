<<<<<<< HEAD
# SixSeven
=======
# Pharmacogenomic VCF Parser

A Python library for parsing VCF v4.2 files and extracting pharmacogenomic variant information for clinical decision support and machine learning applications.

## Features

- Parse VCF v4.2 files line-by-line for memory efficiency
- Extract variants for 6 key pharmacogenomic genes (CYP2D6, CYP2C19, CYP2C9, SLCO1B1, TPMT, DPYD)
- Identify STAR alleles and construct diplotypes
- Map diplotypes to metabolizer phenotypes (PM, IM, NM, RM, URM)
- Structured JSON output for ML models
- Robust error handling

## Installation

```bash
pip install -e .
```

For development with testing dependencies:

```bash
pip install -e ".[dev]"
```

## Usage

### Python API

```python
from pgx_vcf_parser import parse_pgx_vcf

# Parse a VCF file
results = parse_pgx_vcf("patient_variants.vcf")

# Access results for each gene
cyp2c19_result = results["CYP2C19"]
print(f"Diplotype: {cyp2c19_result['diplotype']}")
print(f"Phenotype: {cyp2c19_result['phenotype']}")
print(f"STAR Alleles: {cyp2c19_result['star_alleles']}")
print(f"rsIDs: {cyp2c19_result['rsids']}")
```

### Command-Line Interface

Parse a VCF file and output JSON:

```bash
python -m pgx_vcf_parser.cli patient_variants.vcf
```

Save output to file:

```bash
python -m pgx_vcf_parser.cli patient_variants.vcf -o results.json
```

Pretty-print results:

```bash
python -m pgx_vcf_parser.cli patient_variants.vcf -f pretty
```

### Example Output

```json
{
  "CYP2C19": {
    "star_alleles": ["*2", "*2"],
    "diplotype": "*2/*2",
    "phenotype": "PM",
    "rsids": ["rs4244285", "rs4986893"]
  },
  "CYP2D6": {
    "star_alleles": ["*1"],
    "diplotype": "*1/*1",
    "phenotype": "NM",
    "rsids": ["rs1057910"]
  },
  "CYP2C9": {
    "star_alleles": [],
    "diplotype": null,
    "phenotype": "Unknown",
    "rsids": []
  },
  ...
}
```

## Phenotype Mapping

The parser maps diplotypes to metabolizer phenotypes:

- **PM (Poor Metabolizer)**: Two loss-of-function alleles
- **IM (Intermediate Metabolizer)**: One loss-of-function allele
- **NM (Normal Metabolizer)**: *1/*1 or normal function alleles
- **RM (Rapid Metabolizer)**: One increased-function allele
- **URM (Ultra-Rapid Metabolizer)**: Two increased-function alleles
- **Unknown**: No alleles found or unrecognized alleles

## Target Genes

The parser focuses on six pharmacogenomic genes:

1. **CYP2C19** - Metabolizes clopidogrel, SSRIs, PPIs
2. **CYP2D6** - Metabolizes codeine, tamoxifen, antidepressants
3. **CYP2C9** - Metabolizes warfarin, NSAIDs
4. **SLCO1B1** - Transports statins
5. **TPMT** - Metabolizes thiopurines
6. **DPYD** - Metabolizes fluoropyrimidines

## VCF Format Requirements

The parser expects VCF v4.2 format with INFO fields containing:

- `GENE`: Gene name (must be one of the six target genes)
- `STAR`: STAR allele designation (e.g., *2, *3)
- `RS`: rsID (optional)

Example VCF line:
```
10	94761900	rs4244285	G	A	.	PASS	GENE=CYP2C19;STAR=*2;RS=rs4244285
```

## Development

Run tests:

```bash
python -m unittest discover tests
```

Run specific test class:

```bash
python -m unittest tests.test_parser.TestInfoFieldParsing
```

## Examples

Sample VCF files are provided in the `examples/` directory:

- `sample_minimal.vcf` - Minimal example with one variant per gene
- `sample_comprehensive.vcf` - Comprehensive example with multiple genes
- `sample_with_errors.vcf` - Example with malformed lines for error handling

Try parsing an example:

```bash
python -m pgx_vcf_parser.cli examples/sample_minimal.vcf -f pretty
```

## License

MIT License
>>>>>>> 0561dc6b9306f1debf342a8f09c649cde5e2a824

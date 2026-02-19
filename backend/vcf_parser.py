import pandas as pd
import io

def parse_vcf(file_content: bytes) -> dict:
    """
    Parses a VCF file content and returns a dictionary of rsID -> Genotype.
    Example: {'rs123': 'AA', 'rs456': 'GT'}
    """
    genotypes = {}
    
    # Decode bytes to string
    content_str = file_content.decode('utf-8')
    
    for line in content_str.split('\n'):
        if line.startswith('#'):
            continue
        
        parts = line.strip().split('\t')
        if len(parts) >= 10:
            chrom = parts[0]
            pos = parts[1]
            rsid = parts[2]
            ref = parts[3]
            alt = parts[4]
            fmt = parts[8]
            sample = parts[9]
            
            # Simple genotype extraction (assuming GT is first field)
            try:
                gt_idx = fmt.split(':').index('GT')
                gt_val = sample.split(':')[gt_idx]
                
                # Convert 0/1, 1/1 to Bases
                alleles = [ref] + alt.split(',')
                
                # Handle / or | separators
                sep = '/' if '/' in gt_val else '|'
                indices = [int(i) for i in gt_val.split(sep) if i != '.']
                
                if len(indices) == 2:
                    a1 = alleles[indices[0]]
                    a2 = alleles[indices[1]]
                    genotypes[rsid] = f"{a1}{a2}"
                    
            except (ValueError, IndexError):
                continue
                
    return genotypes

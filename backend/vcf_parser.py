import os

TARGET_GENES = ["CYP2C19", "CYP2D6", "CYP2C9", "SLCO1B1", "TPMT", "DPYD"]

# --------------------------------------------------
# 1️⃣ Parse INFO Field
# --------------------------------------------------

def parse_info_field(info_string):
    info_dict = {}
    parts = info_string.split(";")
    for part in parts:
        if "=" in part:
            key, value = part.split("=", 1)
            info_dict[key] = value
    return info_dict


# --------------------------------------------------
# 2️⃣ Map Diplotype → Phenotype
# --------------------------------------------------

def map_to_phenotype(gene, alleles):

    # Default
    if len(alleles) == 0:
        return "Unknown"

    # If only one allele found, assume second is *1
    if len(alleles) == 1:
        alleles.append("*1")

    a1, a2 = alleles[0], alleles[1]

    # Simplified logic
    loss_of_function = ["*2", "*3", "*4", "*5"]
    increased_function = ["*17"]

    if a1 in loss_of_function and a2 in loss_of_function:
        return "PM"

    if (a1 in loss_of_function) or (a2 in loss_of_function):
        return "IM"

    if a1 in increased_function or a2 in increased_function:
        return "RM"

    return "NM"


# --------------------------------------------------
# 3️⃣ Main VCF Parser
# --------------------------------------------------

def parse_vcf(file_path):

    if not os.path.exists(file_path):
        raise FileNotFoundError("VCF file not found.")

    gene_data = {gene: [] for gene in TARGET_GENES}

    with open(file_path, "r") as file:
        for line in file:

            # Skip metadata/header lines
            if line.startswith("#"):
                continue

            columns = line.strip().split("\t")

            if len(columns) < 8:
                continue

            info_field = columns[7]
            info_dict = parse_info_field(info_field)

            gene = info_dict.get("GENE")
            star = info_dict.get("STAR")

            if gene in TARGET_GENES and star:
                gene_data[gene].append(star)

    # Build structured output
    result = {}

    for gene, alleles in gene_data.items():

        alleles = alleles[:2]  # Take only first 2 if more exist

        if len(alleles) == 1:
            diplotype = f"{alleles[0]}/*1"
        elif len(alleles) >= 2:
            diplotype = f"{alleles[0]}/{alleles[1]}"
        else:
            diplotype = "Unknown"

        phenotype = map_to_phenotype(gene, alleles.copy())

        result[gene] = {
            "star_alleles": alleles,
            "diplotype": diplotype,
            "phenotype": phenotype
        }

    return result

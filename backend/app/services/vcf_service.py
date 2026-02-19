from vcf_parser import parse_vcf

async def process_vcf(file_content: bytes):
    return parse_vcf(file_content)

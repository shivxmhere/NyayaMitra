from app.services.gemini_service import call_gemini

HINDI_LEGAL_SYSTEM_PROMPT = """
Tum NyayaMitra ho — ek AI jo India ke garib logon ko kanoon samajhne mein 
madad karta hai. Tum ek experienced legal aid worker ki tarah baat karte ho — 
simple, clear Hindi mein. Legal jargon mat use karo. Aam aadmi ki boli use karo.
Kabhi bhi specific legal advice mat do ya koi guarantee mat do.
Hamesha suggest karo ki woh ek free legal aid lawyer se mile.
"""

FALLBACK_HINDI_SUMMARY = """• कैदी {name} (उम्र {age} वर्ष) को {police_station} थाने से गिरफ्तार किया गया
• FIR नंबर: {fir_number}
• धाराएं: {charges}
• अदालत: {court_name}
• गिरफ्तारी तिथि: {arrest_date}
• स्थिति: {status}
• परिवार को DLSA (जिला विधिक सेवा प्राधिकरण) से संपर्क करना चाहिए
• मुफ्त कानूनी सहायता हेल्पलाइन: 15100
• अगली सुनवाई की तारीख पर अदालत में उपस्थित रहें"""

FALLBACK_ENGLISH_SUMMARY = """• Prisoner {name} (age {age} years) was arrested from {police_station} police station
• FIR Number: {fir_number}
• Charges: {charges}
• Court: {court_name}
• Arrest Date: {arrest_date}
• Status: {status}
• Family should contact DLSA (District Legal Services Authority)
• Free legal aid helpline: 15100
• Be present in court on the next hearing date"""


async def summarize_case_hindi(case) -> str:
    prompt = f"""
    {HINDI_LEGAL_SYSTEM_PROMPT}
    
    Ek family ke liye case ki simple summary likho:
    - Prisoner: {case.prisoner_name}, umar {case.prisoner_age} saal
    - FIR number: {case.fir_number}, {case.police_station} thana
    - Charges: {case.charges}
    - Court: {case.court_name}
    - Arrest date: {case.arrest_date}
    - Case status: {case.case_status}
    
    150 words mein batao: kya hua, abhi case kahan hai, family ko kya karna chahiye.
    Simple Hindi mein. Bullet points use karo.
    """
    result = await call_gemini(prompt)
    if not result:
        result = FALLBACK_HINDI_SUMMARY.format(
            name=case.prisoner_name,
            age=case.prisoner_age,
            police_station=case.police_station,
            fir_number=case.fir_number,
            charges=case.charges,
            court_name=case.court_name,
            arrest_date=case.arrest_date,
            status=case.case_status,
        )
    return result


async def summarize_case_english(case) -> str:
    prompt = f"""
    Write a simple case summary for the family in English:
    - Prisoner: {case.prisoner_name}, age {case.prisoner_age}
    - FIR: {case.fir_number}, PS: {case.police_station}
    - Charges: {case.charges}
    - Court: {case.court_name}
    - Arrest date: {case.arrest_date}
    - Status: {case.case_status}
    
    In 150 words, explain: what happened, current status, what family should do next.
    Use simple English. Use bullet points. Mention free legal aid (DLSA/NALSA).
    """
    result = await call_gemini(prompt)
    if not result:
        result = FALLBACK_ENGLISH_SUMMARY.format(
            name=case.prisoner_name,
            age=case.prisoner_age,
            police_station=case.police_station,
            fir_number=case.fir_number,
            charges=case.charges,
            court_name=case.court_name,
            arrest_date=case.arrest_date,
            status=case.case_status,
        )
    return result


async def check_bail_eligibility(charges: str) -> str:
    if not charges or not charges.strip():
        return "unknown"
        
    NON_BAILABLE = ["302", "376", "395", "396", "307", "376AB", "376DA", "376DB"]
    charges_upper = charges.upper()
    for section in NON_BAILABLE:
        if section in charges_upper:
            return "not_eligible"
    return "eligible"

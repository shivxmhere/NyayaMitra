from app.services.gemini_service import call_gemini

DEFAULT_BAIL_GROUNDS = [
    "Accused has been in judicial custody for an unreasonably long period without trial",
    "Accused has no prior criminal record and is a first-time offender",
    "Accused is the sole breadwinner of a dependent family",
    "There is no risk of the accused absconding as they have deep roots in the community",
    "Investigation is complete and accused's presence in custody is no longer required",
    "Continued incarceration violates Article 21 of the Constitution of India",
]

DEFAULT_BAIL_GROUNDS_HINDI = [
    "आरोपी बिना मुकदमे के अनुचित रूप से लंबे समय से न्यायिक हिरासत में है",
    "आरोपी का कोई पूर्व आपराधिक रिकॉर्ड नहीं है और वह पहली बार अपराधी है",
    "आरोपी परिवार का एकमात्र कमाने वाला सदस्य है",
    "आरोपी के फरार होने का कोई खतरा नहीं है क्योंकि उसकी समुदाय में गहरी जड़ें हैं",
    "जांच पूरी हो चुकी है और आरोपी की हिरासत में उपस्थिति अब आवश्यक नहीं है",
    "निरंतर कारावास भारत के संविधान के अनुच्छेद 21 का उल्लंघन करता है",
]

FALLBACK_BAIL_HINDI = """
माननीय न्यायालय {court_name} में

जमानत प्रार्थना पत्र

विषय: FIR संख्या {fir_number}, थाना {police_station}, जिला {district}

माननीय न्यायाधीश महोदय,

प्रार्थी {applicant_name}, आरोपी {prisoner_name} (उम्र {prisoner_age} वर्ष) के संबंधी, निम्नलिखित आधारों पर जमानत की प्रार्थना करते हैं:

{grounds}

अतः प्रार्थी निवेदन करता/करती है कि आरोपी को उचित शर्तों पर जमानत प्रदान की जाए।

प्रार्थी: {applicant_name}
अधिवक्ता: {advocate_name}
"""

FALLBACK_BAIL_ENGLISH = """
IN THE COURT OF {court_name}

BAIL APPLICATION

Re: FIR No. {fir_number}, P.S. {police_station}, District {district}

Hon'ble Sir/Madam,

The applicant, {applicant_name}, a family member of the accused {prisoner_name} (age {prisoner_age} years), most respectfully submits this application for grant of bail on the following grounds:

{grounds}

PRAYER: It is therefore most respectfully prayed that the accused may be granted bail on such terms and conditions as this Hon'ble Court deems fit and proper.

Applicant: {applicant_name}
Advocate: {advocate_name}
"""


async def generate_bail_application(
    case, applicant_name: str, grounds: list, advocate_name: str = None
) -> dict:
    adv_name = advocate_name or "Legal Aid Advocate (to be assigned by DLSA)"
    grounds_text = "\n".join([f"{i+1}. {g}" for i, g in enumerate(grounds)])

    BAIL_PROMPT = f"""
    Generate a formal bail application in Hindi for Indian court.
    
    TO: The Hon'ble {case.court_name}
    Case details:
      Prisoner: {case.prisoner_name}, Age: {case.prisoner_age}
      FIR: {case.fir_number}, PS: {case.police_station}, District: {case.district}
      Charges: {case.charges}
      Arrested: {case.arrest_date}
    
    Applicant (family member): {applicant_name}
    Advocate: {adv_name}
    
    Grounds for bail:
    {grounds_text}
    
    Write a complete, formal bail application in Hindi. Include:
    1. Proper header with court name and case details
    2. Introduction of applicant relation to prisoner
    3. Facts of arrest and detention duration
    4. All grounds for bail in numbered format
    5. Prayer clause asking for bail
    6. Proper closing and signature block
    
    Make it court-ready. Use formal legal Hindi.
    """

    hindi_text = await call_gemini(BAIL_PROMPT)

    if not hindi_text:
        hindi_text = FALLBACK_BAIL_HINDI.format(
            court_name=case.court_name,
            fir_number=case.fir_number,
            police_station=case.police_station,
            district=case.district,
            applicant_name=applicant_name,
            prisoner_name=case.prisoner_name,
            prisoner_age=case.prisoner_age,
            grounds=grounds_text,
            advocate_name=adv_name,
        )

    ENGLISH_PROMPT = f"Translate this bail application to formal legal English:\n\n{hindi_text}"
    english_text = await call_gemini(ENGLISH_PROMPT)

    if not english_text:
        english_text = FALLBACK_BAIL_ENGLISH.format(
            court_name=case.court_name,
            fir_number=case.fir_number,
            police_station=case.police_station,
            district=case.district,
            applicant_name=applicant_name,
            prisoner_name=case.prisoner_name,
            prisoner_age=case.prisoner_age,
            grounds=grounds_text,
            advocate_name=adv_name,
        )

    return {"hindi": hindi_text, "english": english_text}

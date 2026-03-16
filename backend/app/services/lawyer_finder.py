DEMO_LAWYERS = [
    {
        "id": 1,
        "name": "Adv. Ramesh Kumar Verma",
        "bar_council_number": "UP/2156/2008",
        "district": "Prayagraj",
        "state": "Uttar Pradesh",
        "specialization": "Criminal, Bail, Sessions Court",
        "phone": "9415001234",
        "email": "rkverma.adv@email.com",
        "is_legal_aid": True,
        "languages": "Hindi, Urdu, English",
        "cases_handled": 340,
        "rating": 4.6,
        "available": True,
        "note": "Empanelled with DLSA Prayagraj. Free legal aid available.",
    },
    {
        "id": 2,
        "name": "Adv. Sunita Mishra",
        "bar_council_number": "UP/3421/2012",
        "district": "Prayagraj",
        "state": "Uttar Pradesh",
        "specialization": "Criminal, POCSO, High Court",
        "phone": "9415005678",
        "email": "sunita.mishra@email.com",
        "is_legal_aid": True,
        "languages": "Hindi, English, Awadhi",
        "cases_handled": 210,
        "rating": 4.8,
        "available": True,
        "note": "Specializes in bail for long-term undertrials.",
    },
    {
        "id": 3,
        "name": "Adv. Mohd. Salim Khan",
        "bar_council_number": "UP/1892/2005",
        "district": "Prayagraj",
        "state": "Uttar Pradesh",
        "specialization": "Criminal, Sessions, Magistrate Court",
        "phone": "9415009012",
        "email": "salimkhan.law@email.com",
        "is_legal_aid": False,
        "languages": "Hindi, Urdu, English",
        "cases_handled": 520,
        "rating": 4.4,
        "available": True,
        "note": "20 years experience. Fees negotiable for poor families.",
    },
]


def find_lawyers(district: str = "", legal_aid_only: bool = False) -> list:
    lawyers = DEMO_LAWYERS
    if district:
        lawyers = [l for l in lawyers if l["district"].lower() == district.lower()]
    if legal_aid_only:
        lawyers = [l for l in lawyers if l["is_legal_aid"]]
    return lawyers


LEGAL_AID_INFO = {
    "Uttar Pradesh": {
        "body": "Uttar Pradesh State Legal Services Authority (UPSLSA)",
        "phone": "0522-2209903",
        "address": "Lucknow High Court Campus, Lucknow",
        "eligibility": "Annual income below ₹1,00,000 OR SC/ST/women/children/disabled",
    },
    "Prayagraj": {
        "body": "District Legal Services Authority (DLSA) Prayagraj",
        "phone": "0532-2420660",
        "address": "Civil Court Complex, Prayagraj",
        "eligibility": "Free for anyone who cannot afford a lawyer",
    },
    "Allahabad": {
        "body": "District Legal Services Authority (DLSA) Prayagraj",
        "phone": "0532-2420660",
        "address": "Civil Court Complex, Prayagraj",
        "eligibility": "Free for anyone who cannot afford a lawyer",
    },
}


def get_legal_aid_info(district: str = "") -> dict:
    if district in LEGAL_AID_INFO:
        return LEGAL_AID_INFO[district]
    return LEGAL_AID_INFO.get(
        "Uttar Pradesh",
        {
            "body": "National Legal Services Authority (NALSA)",
            "phone": "15100",
            "address": "12/11 Jam Nagar House, New Delhi",
            "eligibility": "Free for anyone who cannot afford a lawyer",
        },
    )

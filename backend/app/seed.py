"""
NyayaMitra Database Seeder
Run: python -m app.seed
"""
import asyncio
from datetime import date, datetime
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession, async_sessionmaker
from sqlalchemy import select
from app.database import Base
from app.config import settings
from app.models import User, Case, BailApplication, Hearing, Lawyer
from app.auth import hash_password


DEMO_SUMMARY_HINDI = """• रमेश कुमार (उम्र 34 वर्ष) को 15 मार्च 2021 को नैनी थाने से गिरफ्तार किया गया था
• FIR नंबर: FIR-2021-PP-2847
• धाराएं: IPC 420 (धोखाधड़ी) और IPC 468 (जालसाजी)
• अदालत: CJM Court, प्रयागराज — न्यायाधीश: अतिरिक्त CJM श्री अरविंद शर्मा
• स्थिति: विचाराधीन (undertrial) — लगभग 3 साल से जेल में हैं
• ✅ यह केस जमानत योग्य है — IPC 420 और 468 जमानती धाराएं हैं
• परिवार को चाहिए कि वो DLSA प्रयागराज से संपर्क करें (फोन: 0532-2420660)
• मुफ्त कानूनी सहायता का अधिकार है — NALSA हेल्पलाइन: 15100
• अगली सुनवाई: 25 मार्च 2024 — अदालत में जरूर जाएं
• जमानत आवेदन तैयार करवाएं — NyayaMitra इसमें मदद कर सकता है"""

DEMO_SUMMARY_ENGLISH = """• Ramesh Kumar (age 34) was arrested on 15 March 2021 from Naini Police Station
• FIR Number: FIR-2021-PP-2847
• Charges: IPC 420 (Cheating) and IPC 468 (Forgery)
• Court: CJM Court, Prayagraj — Judge: Additional CJM Shri Arvind Sharma
• Status: Undertrial — approximately 3 years in custody without conviction
• ✅ This case is bail-eligible — IPC 420 and 468 are bailable offences
• Family should contact DLSA Prayagraj (Phone: 0532-2420660)
• Free legal aid is a constitutional right — NALSA Helpline: 15100
• Next Hearing: 25 March 2024 — must appear in court
• Prepare bail application — NyayaMitra can help with this"""

DEMO_BAIL_HINDI = """माननीय मुख्य न्यायिक मजिस्ट्रेट न्यायालय, प्रयागराज में

जमानत प्रार्थना पत्र

FIR संख्या: FIR-2021-PP-2847
थाना: नैनी, जिला: प्रयागराज
धाराएं: भारतीय दंड संहिता की धारा 420, 468

माननीय न्यायाधीश महोदय,

निवेदिका मीना देवी, आरोपी रमेश कुमार (उम्र 34 वर्ष) की पत्नी, सम्मानपूर्वक निम्नलिखित आधारों पर जमानत की प्रार्थना करती है:

1. आरोपी लगभग 3 वर्षों से न्यायिक हिरासत में है बिना किसी मुकदमे के, जो अनुचित रूप से लंबी अवधि है।

2. आरोपी का कोई पूर्व आपराधिक रिकॉर्ड नहीं है और वह पहली बार अपराधी है।

3. आरोपी परिवार का एकमात्र कमाने वाला सदस्य है। उनकी पत्नी और दो बच्चे उन पर निर्भर हैं।

4. जांच पूरी हो चुकी है और आरोपी की हिरासत में उपस्थिति अब आवश्यक नहीं है।

5. निरंतर कारावास भारत के संविधान के अनुच्छेद 21 के तहत जीवन और स्वतंत्रता के मूल अधिकार का उल्लंघन करता है।

प्रार्थना: अतः प्रार्थिनी सादर निवेदन करती है कि माननीय न्यायालय आरोपी को उचित शर्तों पर जमानत प्रदान करने की कृपा करें।

प्रार्थिनी: मीना देवी
अधिवक्ता: विधिक सहायता अधिवक्ता (DLSA द्वारा नियुक्त)
"""

DEMO_BAIL_ENGLISH = """IN THE COURT OF CHIEF JUDICIAL MAGISTRATE, PRAYAGRAJ

BAIL APPLICATION

FIR No.: FIR-2021-PP-2847
Police Station: Naini, District: Prayagraj
Sections: 420, 468 of the Indian Penal Code

Hon'ble Sir/Madam,

The applicant, Meena Devi, wife of the accused Ramesh Kumar (age 34 years), most respectfully submits this application for the grant of bail on the following grounds:

1. The accused has been in judicial custody for approximately 3 years without trial, which constitutes an unreasonably long period of detention.

2. The accused has no prior criminal record and is a first-time offender with no history of criminal antecedents.

3. The accused is the sole breadwinner of a dependent family consisting of his wife and two minor children.

4. Investigation is complete and the continued presence of the accused in custody is no longer required for the purpose of investigation.

5. The continued incarceration of the accused violates his fundamental right to life and liberty under Article 21 of the Constitution of India.

PRAYER: It is therefore most respectfully prayed that this Hon'ble Court may be pleased to grant bail to the accused on such terms and conditions as this Court deems fit and proper.

Applicant: Meena Devi
Advocate: Legal Aid Advocate (to be assigned by DLSA)
"""


async def seed():
    engine = create_async_engine(settings.DATABASE_URL, echo=False)
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

    async_session = async_sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)

    async with async_session() as db:
        # Check if already seeded
        result = await db.execute(select(User).where(User.username == "meena"))
        if result.scalar_one_or_none():
            print("⚠️  Database already seeded. Skipping.")
            return

        # ── Users ──
        meena = User(
            username="meena",
            email="meena.devi@example.com",
            full_name="Meena Devi",
            hashed_password=hash_password("meena123"),
            phone="9876543210",
            language="hindi",
            role="citizen",
            district="Prayagraj",
            state="Uttar Pradesh",
        )
        advocate = User(
            username="advocate",
            email="advocate.demo@example.com",
            full_name="Adv. Demo User",
            hashed_password=hash_password("adv123"),
            phone="9876543211",
            language="english",
            role="lawyer",
            district="Prayagraj",
            state="Uttar Pradesh",
        )
        db.add_all([meena, advocate])
        await db.commit()
        await db.refresh(meena)
        await db.refresh(advocate)

        # ── Demo Case ──
        demo_case = Case(
            user_id=meena.id,
            prisoner_name="Ramesh Kumar",
            prisoner_age=34,
            fir_number="FIR-2021-PP-2847",
            police_station="Naini",
            district="Prayagraj",
            state="Uttar Pradesh",
            charges="IPC 420, IPC 468",
            case_status="undertrial",
            court_name="CJM Court, Prayagraj",
            judge_name="Additional CJM Shri Arvind Sharma",
            arrest_date=date(2021, 3, 15),
            last_hearing=date(2024, 2, 10),
            next_hearing=date(2024, 3, 25),
            bail_eligibility="eligible",
            ai_summary_hindi=DEMO_SUMMARY_HINDI,
            ai_summary_english=DEMO_SUMMARY_ENGLISH,
        )
        db.add(demo_case)
        await db.commit()
        await db.refresh(demo_case)

        # ── Demo Hearings ──
        hearings = [
            Hearing(
                case_id=demo_case.id,
                hearing_date=date(2021, 4, 20),
                court_name="CJM Court, Prayagraj",
                judge_name="CJM Shri R.K. Pandey",
                hearing_type="bail",
                outcome="Bail denied — prosecution objected citing severity of charges",
                notes="First bail hearing after arrest",
            ),
            Hearing(
                case_id=demo_case.id,
                hearing_date=date(2021, 9, 15),
                court_name="CJM Court, Prayagraj",
                judge_name="CJM Shri R.K. Pandey",
                hearing_type="framing",
                outcome="Charges framed under IPC 420, 468",
                notes="Charge sheet filed by prosecution",
            ),
            Hearing(
                case_id=demo_case.id,
                hearing_date=date(2022, 6, 10),
                court_name="CJM Court, Prayagraj",
                judge_name="Additional CJM Shri Arvind Sharma",
                hearing_type="evidence",
                outcome="Prosecution evidence started — 2 witnesses examined",
                notes="Judge transferred. New judge assigned.",
            ),
            Hearing(
                case_id=demo_case.id,
                hearing_date=date(2023, 3, 5),
                court_name="CJM Court, Prayagraj",
                judge_name="Additional CJM Shri Arvind Sharma",
                hearing_type="evidence",
                outcome="3 more prosecution witnesses examined. Defense evidence pending.",
                notes="Case delayed due to judge on leave for 2 months",
            ),
            Hearing(
                case_id=demo_case.id,
                hearing_date=date(2024, 2, 10),
                court_name="CJM Court, Prayagraj",
                judge_name="Additional CJM Shri Arvind Sharma",
                hearing_type="arguments",
                outcome="Prosecution arguments heard. Defense to argue next.",
                notes="Accused has spent 3 years in custody",
            ),
            Hearing(
                case_id=demo_case.id,
                hearing_date=date(2024, 3, 25),
                court_name="CJM Court, Prayagraj",
                judge_name="Additional CJM Shri Arvind Sharma",
                hearing_type="arguments",
                outcome=None,
                next_date=None,
                notes="Upcoming: Defense arguments to be heard",
            ),
        ]
        db.add_all(hearings)

        # ── Demo Bail Application ──
        bail_app = BailApplication(
            case_id=demo_case.id,
            user_id=meena.id,
            generated_text=DEMO_BAIL_HINDI,
            generated_text_english=DEMO_BAIL_ENGLISH,
            applicant_name="Meena Devi",
            advocate_name=None,
            court_address="CJM Court, Prayagraj",
            grounds="3 years in custody without trial, First-time offender, Sole breadwinner",
            status="draft",
        )
        db.add(bail_app)

        # ── Demo Lawyers ──
        lawyers_data = [
            Lawyer(
                name="Adv. Ramesh Kumar Verma",
                bar_council_number="UP/2156/2008",
                district="Prayagraj",
                state="Uttar Pradesh",
                specialization="Criminal, Bail, Sessions Court",
                phone="9415001234",
                email="rkverma.adv@email.com",
                is_legal_aid=True,
                languages="Hindi, Urdu, English",
                cases_handled=340,
                rating=4.6,
                available=True,
            ),
            Lawyer(
                name="Adv. Sunita Mishra",
                bar_council_number="UP/3421/2012",
                district="Prayagraj",
                state="Uttar Pradesh",
                specialization="Criminal, POCSO, High Court",
                phone="9415005678",
                email="sunita.mishra@email.com",
                is_legal_aid=True,
                languages="Hindi, English, Awadhi",
                cases_handled=210,
                rating=4.8,
                available=True,
            ),
            Lawyer(
                name="Adv. Mohd. Salim Khan",
                bar_council_number="UP/1892/2005",
                district="Prayagraj",
                state="Uttar Pradesh",
                specialization="Criminal, Sessions, Magistrate Court",
                phone="9415009012",
                email="salimkhan.law@email.com",
                is_legal_aid=False,
                languages="Hindi, Urdu, English",
                cases_handled=520,
                rating=4.4,
                available=True,
            ),
        ]
        db.add_all(lawyers_data)

        await db.commit()
        print("✅ NyayaMitra seeded successfully!")
        print("   Login credentials:")
        print("   👩 Citizen: meena / meena123")
        print("   ⚖️  Advocate: advocate / adv123")


if __name__ == "__main__":
    asyncio.run(seed())

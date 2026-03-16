// Full offline fallback data for demo mode

export const DEMO_CASE = {
  id: 1,
  user_id: 1,
  prisoner_name: "Ramesh Kumar",
  prisoner_age: 34,
  fir_number: "FIR-2021-PP-2847",
  police_station: "Naini",
  district: "Prayagraj",
  state: "Uttar Pradesh",
  charges: "IPC 420, IPC 468",
  case_status: "undertrial",
  court_name: "CJM Court, Prayagraj",
  judge_name: "Additional CJM Shri Arvind Sharma",
  arrest_date: "2021-03-15",
  last_hearing: "2024-02-10",
  next_hearing: "2024-03-25",
  ai_summary_hindi: `• रमेश कुमार (उम्र 34 वर्ष) को 15 मार्च 2021 को नैनी थाने से गिरफ्तार किया गया था
• FIR नंबर: FIR-2021-PP-2847
• धाराएं: IPC 420 (धोखाधड़ी) और IPC 468 (जालसाजी)
• अदालत: CJM Court, प्रयागराज — न्यायाधीश: अतिरिक्त CJM श्री अरविंद शर्मा
• स्थिति: विचाराधीन (undertrial) — लगभग 3 साल से जेल में हैं
• ✅ यह केस जमानत योग्य है — IPC 420 और 468 जमानती धाराएं हैं
• परिवार को चाहिए कि वो DLSA प्रयागराज से संपर्क करें (फोन: 0532-2420660)
• मुफ्त कानूनी सहायता का अधिकार है — NALSA हेल्पलाइन: 15100
• अगली सुनवाई: 25 मार्च 2024 — अदालत में जरूर जाएं
• जमानत आवेदन तैयार करवाएं — NyayaMitra इसमें मदद कर सकता है`,
  ai_summary_english: `• Ramesh Kumar (age 34) was arrested on 15 March 2021 from Naini Police Station
• FIR Number: FIR-2021-PP-2847
• Charges: IPC 420 (Cheating) and IPC 468 (Forgery)
• Court: CJM Court, Prayagraj — Judge: Additional CJM Shri Arvind Sharma
• Status: Undertrial — approximately 3 years in custody without conviction
• ✅ This case is bail-eligible — IPC 420 and 468 are bailable offences
• Family should contact DLSA Prayagraj (Phone: 0532-2420660)
• Free legal aid is a constitutional right — NALSA Helpline: 15100
• Next Hearing: 25 March 2024 — must appear in court
• Prepare bail application — NyayaMitra can help with this`,
  bail_eligibility: "eligible",
  created_at: "2021-03-16T10:00:00",
};

export const DEMO_HEARINGS = [
  {
    id: 1, case_id: 1,
    hearing_date: "2021-04-20", court_name: "CJM Court, Prayagraj",
    judge_name: "CJM Shri R.K. Pandey", hearing_type: "bail",
    outcome: "Bail denied — prosecution objected citing severity of charges",
    notes: "First bail hearing after arrest", reminder_sent: false
  },
  {
    id: 2, case_id: 1,
    hearing_date: "2021-09-15", court_name: "CJM Court, Prayagraj",
    judge_name: "CJM Shri R.K. Pandey", hearing_type: "framing",
    outcome: "Charges framed under IPC 420, 468",
    notes: "Charge sheet filed by prosecution", reminder_sent: false
  },
  {
    id: 3, case_id: 1,
    hearing_date: "2022-06-10", court_name: "CJM Court, Prayagraj",
    judge_name: "Additional CJM Shri Arvind Sharma", hearing_type: "evidence",
    outcome: "Prosecution evidence started — 2 witnesses examined",
    notes: "Judge transferred. New judge assigned.", reminder_sent: false
  },
  {
    id: 4, case_id: 1,
    hearing_date: "2023-03-05", court_name: "CJM Court, Prayagraj",
    judge_name: "Additional CJM Shri Arvind Sharma", hearing_type: "evidence",
    outcome: "3 more prosecution witnesses examined. Defense evidence pending.",
    notes: "Case delayed due to judge on leave for 2 months", reminder_sent: false
  },
  {
    id: 5, case_id: 1,
    hearing_date: "2024-02-10", court_name: "CJM Court, Prayagraj",
    judge_name: "Additional CJM Shri Arvind Sharma", hearing_type: "arguments",
    outcome: "Prosecution arguments heard. Defense to argue next.",
    notes: "Accused has spent 3 years in custody", reminder_sent: false
  },
  {
    id: 6, case_id: 1,
    hearing_date: "2024-03-25", court_name: "CJM Court, Prayagraj",
    judge_name: "Additional CJM Shri Arvind Sharma", hearing_type: "arguments",
    outcome: null, next_date: null,
    notes: "Upcoming: Defense arguments to be heard", reminder_sent: false
  },
];

export const DEMO_BAIL = {
  id: 1, case_id: 1,
  generated_text: `माननीय मुख्य न्यायिक मजिस्ट्रेट न्यायालय, प्रयागराज में

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
अधिवक्ता: विधिक सहायता अधिवक्ता (DLSA द्वारा नियुक्त)`,
  generated_text_english: `IN THE COURT OF CHIEF JUDICIAL MAGISTRATE, PRAYAGRAJ

BAIL APPLICATION

FIR No.: FIR-2021-PP-2847
Police Station: Naini, District: Prayagraj
Sections: 420, 468 of the Indian Penal Code

Hon'ble Sir/Madam,

The applicant, Meena Devi, wife of the accused Ramesh Kumar (age 34 years), most respectfully submits this application for the grant of bail on the following grounds:

1. The accused has been in judicial custody for approximately 3 years without trial.

2. The accused has no prior criminal record and is a first-time offender.

3. The accused is the sole breadwinner of a dependent family.

4. Investigation is complete and the continued presence of the accused in custody is no longer required.

5. The continued incarceration violates Article 21 of the Constitution of India.

PRAYER: It is therefore most respectfully prayed that this Hon'ble Court may be pleased to grant bail to the accused.

Applicant: Meena Devi
Advocate: Legal Aid Advocate (to be assigned by DLSA)`,
  applicant_name: "Meena Devi",
  advocate_name: null,
  grounds: "3 years in custody without trial, First-time offender, Sole breadwinner",
  status: "draft",
  generated_at: "2024-02-15T10:00:00",
};

export const DEMO_LAWYERS = [
  {
    id: 1, name: "Adv. Ramesh Kumar Verma", bar_council_number: "UP/2156/2008",
    district: "Prayagraj", state: "Uttar Pradesh",
    specialization: "Criminal, Bail, Sessions Court",
    phone: "9415001234", email: "rkverma.adv@email.com",
    is_legal_aid: true, languages: "Hindi, Urdu, English",
    cases_handled: 340, rating: 4.6, available: true,
    note: "Empanelled with DLSA Prayagraj. Free legal aid available."
  },
  {
    id: 2, name: "Adv. Sunita Mishra", bar_council_number: "UP/3421/2012",
    district: "Prayagraj", state: "Uttar Pradesh",
    specialization: "Criminal, POCSO, High Court",
    phone: "9415005678", email: "sunita.mishra@email.com",
    is_legal_aid: true, languages: "Hindi, English, Awadhi",
    cases_handled: 210, rating: 4.8, available: true,
    note: "Specializes in bail for long-term undertrials."
  },
  {
    id: 3, name: "Adv. Mohd. Salim Khan", bar_council_number: "UP/1892/2005",
    district: "Prayagraj", state: "Uttar Pradesh",
    specialization: "Criminal, Sessions, Magistrate Court",
    phone: "9415009012", email: "salimkhan.law@email.com",
    is_legal_aid: false, languages: "Hindi, Urdu, English",
    cases_handled: 520, rating: 4.4, available: true,
    note: "20 years experience. Fees negotiable for poor families."
  },
];

export const DEMO_CHAT = [
  {
    id: 1, message: "जमानत कैसे मिलती है?",
    response: "जमानत लेने के लिए अदालत में जमानत आवेदन दाखिल करना होता है। इसमें यह बताना होता है कि आरोपी को क्यों जमानत दी जानी चाहिए। NyayaMitra आपके लिए जमानत आवेदन तैयार कर सकता है। यदि आप वकील नहीं ले सकते, तो DLSA (जिला विधिक सेवा प्राधिकरण) से मुफ्त वकील मिल सकता है।",
    language: "hindi", created_at: "2024-02-14T08:30:00"
  },
  {
    id: 2, message: "मुफ्त वकील कहाँ मिलेगा?",
    response: "मुफ्त वकील पाने के लिए अपने जिले के DLSA से संपर्क करें। प्रयागराज DLSA का फोन: 0532-2420660। NALSA हेल्पलाइन: 15100 पर कॉल करें। यदि आपकी सालाना आमदनी ₹1,00,000 से कम है, या आप SC/ST/महिला हैं, तो आपको मुफ्त वकील का अधिकार है।",
    language: "hindi", created_at: "2024-02-14T08:35:00"
  },
  {
    id: 3, message: "कितने दिन में जमानत मिल सकती है?",
    response: "जमानत आवेदन दाखिल करने के बाद आमतौर पर 1-3 दिन में सुनवाई होती है। लेकिन यह न्यायाधीश, केस की गंभीरता और अदालत की व्यस्तता पर निर्भर करता है। जमानती अपराधों में जमानत जल्दी मिल सकती है।",
    language: "hindi", created_at: "2024-02-14T09:00:00"
  },
  {
    id: 4, message: "FIR की copy कैसे मिलेगी?",
    response: "FIR की कॉपी लेने के लिए उस थाने में जाएं जहां FIR दर्ज है। धारा 154(2) CrPC के तहत आपको FIR की कॉपी मिलना आपका अधिकार है — यह मुफ्त है। अगर थाना FIR कॉपी देने से मना करे, तो SP (पुलिस अधीक्षक) को शिकायत करें।",
    language: "hindi", created_at: "2024-02-14T09:15:00"
  },
  {
    id: 5, message: "अगली सुनवाई में क्या करना होगा?",
    response: "अगली सुनवाई 25 मार्च 2024 को है। आपको अदालत में समय पर पहुंचना होगा। अपने साथ सभी दस्तावेज लेकर जाएं — FIR कॉपी, पिछले आदेश, और कोई भी ज़रूरी कागज़ात। अगर वकील नहीं है, तो DLSA से मुफ्त वकील की मांग करें।",
    language: "hindi", created_at: "2024-02-14T09:30:00"
  },
];

export const DEFAULT_BAIL_GROUNDS_HINDI = [
  "आरोपी बिना मुकदमे के अनुचित रूप से लंबे समय से न्यायिक हिरासत में है",
  "आरोपी का कोई पूर्व आपराधिक रिकॉर्ड नहीं है और वह पहली बार अपराधी है",
  "आरोपी परिवार का एकमात्र कमाने वाला सदस्य है",
  "आरोपी के फरार होने का कोई खतरा नहीं है क्योंकि उसकी समुदाय में गहरी जड़ें हैं",
  "जांच पूरी हो चुकी है और आरोपी की हिरासत में उपस्थिति अब आवश्यक नहीं है",
  "निरंतर कारावास भारत के संविधान के अनुच्छेद 21 का उल्लंघन करता है",
];

export const DEFAULT_BAIL_GROUNDS_ENGLISH = [
  "Accused has been in judicial custody for an unreasonably long period without trial",
  "Accused has no prior criminal record and is a first-time offender",
  "Accused is the sole breadwinner of a dependent family",
  "There is no risk of the accused absconding as they have deep roots in the community",
  "Investigation is complete and accused's presence in custody is no longer required",
  "Continued incarceration violates Article 21 of the Constitution of India",
];

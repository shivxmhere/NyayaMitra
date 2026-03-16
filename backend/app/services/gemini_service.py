import google.generativeai as genai
import asyncio
from app.config import settings

try:
    genai.configure(api_key=settings.GEMINI_API_KEY)
except Exception:
    pass

LANGUAGE_MAP = {
    "hindi": "Hindi (हिंदी)",
    "english": "English",
    "bhojpuri": "Bhojpuri (भोजपुरी)",
    "hinglish": "Hinglish (mixed Hindi-English)",
    "awadhi": "Awadhi (अवधी)",
    "urdu": "Urdu (اردو)",
}

NYAYA_SYSTEM_PROMPT = """
Tum NyayaMitra ho — India ke sabse trusted AI legal companion.
Tum ek experienced legal aid paralegal ki tarah kaam karte ho jo garib 
families ko court system samajhne mein free mein madad karta hai.

NIYAM:
1. Hamesha us language mein jawab do jo user ne choose ki hai
2. Simple, clear language use karo — legal jargon avoid karo
3. KABHI specific legal advice ya outcome guarantee mat do
4. Hamesha free legal aid (DLSA/NALSA) ke baare mein batao
5. Crisis mein (e.g. immediate bail needed): DLSA helpline suggest karo
6. Warm, compassionate tone — ye families bahut stress mein hain
7. Short responses (max 200 words) — mobile-first users hain
"""

FALLBACK_RESPONSES = {
    "hindi": {
        "response": "नमस्ते! मैं न्यायमित्र हूँ। आपकी मदद के लिए यहाँ हूँ। अभी AI सेवा उपलब्ध नहीं है, लेकिन आप अपने जिले के DLSA (District Legal Services Authority) से संपर्क कर सकते हैं — वो मुफ्त कानूनी सहायता देते हैं। NALSA हेल्पलाइन: 15100",
        "suggested_actions": [
            "DLSA हेल्पलाइन पर कॉल करें: 15100",
            "अपने जिले में मुफ्त वकील खोजें",
            "अपना केस दर्ज करें",
        ],
    },
    "english": {
        "response": "Hello! I'm NyayaMitra. I'm here to help you. The AI service is currently unavailable, but you can contact your district DLSA (District Legal Services Authority) for free legal aid. NALSA helpline: 15100",
        "suggested_actions": [
            "Call DLSA helpline: 15100",
            "Find a free lawyer in your district",
            "Register your case",
        ],
    },
}


async def get_nyaya_response(
    message: str, language: str, case_context: str = ""
) -> dict:
    try:
        if settings.GEMINI_API_KEY == "your_gemini_api_key_here":
            raise ValueError("No API key configured")

        model = genai.GenerativeModel("gemini-pro")

        context = f"\n\nCase context:\n{case_context}" if case_context else ""
        language_name = LANGUAGE_MAP.get(language, "Hindi")

        prompt = f"""{NYAYA_SYSTEM_PROMPT}

Respond in: {language_name}
{context}
User's message: {message}

Also suggest 2-3 next actions the user should take (in same language, as short bullet points).
Format: 
RESPONSE: [your response here]
ACTIONS: [action1] | [action2] | [action3]
"""

        response = await asyncio.to_thread(model.generate_content, prompt)
        text = response.text

        response_text = text
        actions = []

        if "RESPONSE:" in text and "ACTIONS:" in text:
            parts = text.split("ACTIONS:")
            response_text = parts[0].replace("RESPONSE:", "").strip()
            actions = [a.strip() for a in parts[1].split("|")]

        return {"response": response_text, "suggested_actions": actions}

    except Exception:
        fallback = FALLBACK_RESPONSES.get(language, FALLBACK_RESPONSES["hindi"])
        return fallback


async def call_gemini(prompt: str) -> str:
    try:
        if settings.GEMINI_API_KEY == "your_gemini_api_key_here":
            raise ValueError("No API key configured")

        model = genai.GenerativeModel("gemini-pro")
        response = await asyncio.to_thread(model.generate_content, prompt)
        return response.text
    except Exception:
        return ""

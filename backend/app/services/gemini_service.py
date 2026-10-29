import logging
import httpx
from backend.app.core.config import settings

logger = logging.getLogger("MailGuardGemini")

GEMINI_MODEL = "gemini-3.5-flash-lite"

def analyze_threat_with_gemini(subject: str | None, email_text: str, predicted_label: str) -> dict:
    """
    Uses Google's Gemini AI to generate an expert cybersecurity threat analysis.
    """
    api_key = settings.GEMINI_API_KEY
    if not api_key:
        return {
            "success": False,
            "error": "Gemini API key is not configured in backend/.env"
        }

    url = f"https://generativelanguage.googleapis.com/v1beta/models/{GEMINI_MODEL}:generateContent?key={api_key}"

    prompt = f"""You are a Lead Cybersecurity Intelligence Analyst for MailGuard AI.
An email was classified by our ML engine as: {predicted_label}.

Email Subject: {subject or '(No subject)'}
Email Content:
\"\"\"{email_text}\"\"\"

Analyze this email from a cybersecurity standpoint. Provide a clear, concise assessment:
1. **Threat Assessment**: In 2-3 sentences, explain why this email is or isn't dangerous.
2. **Tactics & Deception**: Mention any social engineering tactics (e.g., artificial urgency, fake authority, brand impersonation, link lures) or confirm if it looks like genuine business communication.
3. **Recommended User Action**: Give 1-2 clear bullet points of advice for the recipient.

Format your response cleanly in readable markdown without conversational filler.
"""

    payload = {
        "contents": [{
            "parts": [{"text": prompt}]
        }],
        "generationConfig": {
            "temperature": 0.2,
            "maxOutputTokens": 600
        }
    }

    try:
        with httpx.Client(timeout=25.0) as client:
            resp = client.post(url, json=payload)
            if resp.status_code == 200:
                data = resp.json()
                text = data["candidates"][0]["content"]["parts"][0]["text"]
                return {
                    "success": True,
                    "model": GEMINI_MODEL,
                    "analysis": text
                }
            else:
                logger.error(f"Gemini API returned error status {resp.status_code}: {resp.text}")
                return {
                    "success": False,
                    "error": f"Gemini API error ({resp.status_code})"
                }
    except Exception as e:
        logger.error(f"Exception calling Gemini API: {e}")
        return {
            "success": False,
            "error": str(e)
        }


import re
import html

def clean_text(text: str) -> str:
    """
    Cleans raw email text for machine learning inference.
    - Decodes HTML entities
    - Removes excessive whitespaces and control characters
    - Normalizes URLs and email mentions
    """
    if not text:
        return ""
    
    # Decode HTML entities like &amp; &lt; etc.
    text = html.unescape(text)
    
    # Replace URLs with token
    text = re.sub(r'https?://\S+|www\.\S+', ' urltoken ', text)
    
    # Replace email addresses with token
    text = re.sub(r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,7}\b', ' emailtoken ', text)
    
    # Replace multiple digits or currency numbers with token
    text = re.sub(r'\$\d+', ' moneytoken ', text)
    text = re.sub(r'\b\d{4,}\b', ' numbertoken ', text)
    
    # Remove non-alphanumeric characters except basic punctuation
    text = re.sub(r'[^a-zA-Z0-9\s.,!?$]', ' ', text)
    
    # Collapse multiple spaces and trim
    text = re.sub(r'\s+', ' ', text).strip().lower()
    
    return text

def format_email_input(subject: str | None, email_text: str) -> str:
    """
    Combines subject and email body into a single structured text for vectorization.
    """
    subject_clean = clean_text(subject or "")
    body_clean = clean_text(email_text or "")
    
    if subject_clean:
        return f"subject: {subject_clean} body: {body_clean}"
    return body_clean


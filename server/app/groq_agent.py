from groq import Groq
import os

def get_client():
    global _client
    if _client is None:
        api_key = os.getenv("GROQ_API_KEY")
        if not api_key:
            raise RuntimeError("GROQ_API_KEY is not set")
        _client = Groq(api_key=api_key)
    return _client

def groq_reply(user_msg: str) -> str:
    prompt = f"""
You are a real human texting casually.
Keep replies short./
Use lowercase.
You can be imperfect.
No explanations.

User: {user_msg}
Reply:
"""

    response = client.chat.completions.create(
        model="llama-3.1-8b-instant",
        messages=[
            {"role": "user", "content": prompt}
        ],
        temperature=0.9,
        max_tokens=60,
    )

    reply = response.choices[0].message.content.strip()
    return reply.split("\n")[0][:120]
